import bcrypt from "bcrypt";

import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  UserResponseDto,
  LogoutDto,
  ChangePasswordDto,
} from "../dtos/auth.dto";

import { ForgotPasswordDto } from "../dtos/forgot-password.dto";

import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import { IRefreshTokenRepository } from "../interfaces/repositories/refresh-token.repository.interface";
import { IPasswordResetTokenRepository } from "../interfaces/repositories/password-reset-token.repository.interface";
import { EmailService } from "../services/email.service";

import { logger } from "../config/logger";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRefreshTokenExpirationDate,
} from "../utils/jwt";

import { generateResetToken } from "../utils/reset-token";

import { hashToken } from "../utils/hash";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    private readonly emailService: EmailService,
  ) {}

  // =========================
  // REGISTER
  // =========================

  async register(data: RegisterDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    logger.info(
      {
        email: user.email,
      },
      "User Registered",
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  // =========================
  // LOGIN
  // =========================

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmailWithPassword(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    const tokenHash = hashToken(refreshToken);

    const expiresAt = generateRefreshTokenExpirationDate();

    await this.refreshTokenRepository.create(user.id, tokenHash, expiresAt);

    return {
      accessToken,
      refreshToken,
    };
  }

  // =========================
  // REFRESH TOKEN
  // =========================

  async refresh(data: RefreshTokenDto) {
    let payload;

    try {
      payload = verifyRefreshToken(data.refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const tokenHash = hashToken(data.refreshToken);

    const storedToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Delete old refresh token
    await this.refreshTokenRepository.deleteById(storedToken.id);

    const tokenPayload = {
      userId: payload.userId,
      role: payload.role,
    };

    // Generate new access token
    const accessToken = generateAccessToken(tokenPayload);

    // Generate new refresh token
    const refreshToken = generateRefreshToken(tokenPayload);

    // Hash new refresh token before storing
    const newTokenHash = hashToken(refreshToken);

    // Calculate new expiration
    const expiresAt = generateRefreshTokenExpirationDate();

    // Store new refresh token
    await this.refreshTokenRepository.create(
      payload.userId,
      newTokenHash,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(data: LogoutDto) {
    const { refreshToken } = data;

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const tokenHash = hashToken(refreshToken);

    const storedToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Delete the refresh token from the database
    await this.refreshTokenRepository.deleteById(storedToken.id);

    logger.info(
      {
        userId: payload.userId,
      },
      "User Logged Out",
    );
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await this.userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const isMatch = await bcrypt.compare(data.currentPassword, user.password);

    if (!isMatch) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);

    await this.refreshTokenRepository.deleteAllByUserId(userId);

    logger.info(
      {
        userId: userId,
      },
      "User Password Changed",
    );
  }

  async forgetPassword(data: ForgotPasswordDto) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      return; // Do not reveal that the email does not exist
    }

    const resetToken = generateResetToken();

    const hashedResetToken = hashToken(resetToken);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.passwordResetTokenRepository.create(
      user.id,
      hashedResetToken,
      expiresAt,
    );

   

    logger.info(
      {
        userId: user.id,
        email: user.email,
      },
      "Password Reset Token Created",
    );
    await this.emailService.sendPasswordResetEmail(
    user.email,
    resetToken
  );

  }

  async resetPassword(data: ResetPasswordDto) {
    const hashedToken = hashToken(data.token);

    const resetTokenRecord =
      await this.passwordResetTokenRepository.findByTokenHash(hashedToken);

    if (!resetTokenRecord) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }
    
    if (resetTokenRecord.expiresAt < new Date()) {
     await this.passwordResetTokenRepository.deleteById(resetTokenRecord.id);
     resetTokenRecord._id.toString()
     throw new UnauthorizedError("invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await this.userRepository.updatePassword(
      resetTokenRecord.userId.toString(),
      passwordHash,
    );
    
    await this.passwordResetTokenRepository.deleteById(resetTokenRecord.id.toString());

    await this.refreshTokenRepository.deleteAllByUserId(resetTokenRecord.userId.toString());

    logger.info(
      {
        userId: resetTokenRecord.userId.toString(),
      },
      "User Password Reset Successfully",
    );


  }
}
