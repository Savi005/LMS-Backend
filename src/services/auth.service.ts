import bcrypt from "bcrypt";

import {
    LoginDto,
    RegisterDto,
    RefreshTokenDto,
    UserResponseDto,
    LogoutDto,
    ChangePasswordDto,
} from "../dtos/auth.dto";

import { ConflictError } from "../errors/ConflictError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

import { IUserRepository } from "../interfaces/repositories/user.repository.interface";
import { IRefreshTokenRepository } from "../interfaces/repositories/refresh-token.repository.interface";

import { logger } from "../config/logger";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateRefreshTokenExpirationDate,
} from "../utils/jwt";

import { hashToken } from "../utils/hash";

export class AuthService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly refreshTokenRepository: IRefreshTokenRepository
    ) {}

    // =========================
    // REGISTER
    // =========================

    async register(data: RegisterDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findByEmail(
            data.email
        );

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
            "User Registered"
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
        const user =
            await this.userRepository.findByEmailWithPassword(
                data.email
            );

        if (!user) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(
            data.password,
            user.password
        );

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

        const expiresAt =
            generateRefreshTokenExpirationDate();

        await this.refreshTokenRepository.create(
            user.id,
            tokenHash,
            expiresAt
        );

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
            throw new UnauthorizedError(
                "Invalid refresh token"
            );
        }

        const tokenHash = hashToken(data.refreshToken);

        const storedToken =
            await this.refreshTokenRepository.findByTokenHash(
                tokenHash
            );

        if (!storedToken) {
            throw new UnauthorizedError(
                "Invalid refresh token"
            );
        }

        // Delete old refresh token
        await this.refreshTokenRepository.deleteById(
            storedToken.id
        );

        const tokenPayload = {
            userId: payload.userId,
            role: payload.role,
        };

        // Generate new access token
        const accessToken =
            generateAccessToken(tokenPayload);

        // Generate new refresh token
        const refreshToken =
            generateRefreshToken(tokenPayload);

        // Hash new refresh token before storing
        const newTokenHash =
            hashToken(refreshToken);

        // Calculate new expiration
        const expiresAt =
            generateRefreshTokenExpirationDate();

        // Store new refresh token
        await this.refreshTokenRepository.create(
            payload.userId,
            newTokenHash,
            expiresAt
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(data: LogoutDto) {
        const {refreshToken} = data;

        let payload;
        
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            throw new UnauthorizedError(
                "Invalid refresh token"
            );
        }

        const tokenHash = hashToken(refreshToken);
        
        const storedToken =
            await this.refreshTokenRepository.findByTokenHash(
                tokenHash
            );

            if (!storedToken) {
                throw new UnauthorizedError(
                    "Invalid refresh token"
                );
            }
            
        // Delete the refresh token from the database
        await this.refreshTokenRepository.deleteById(
            storedToken.id
        );

        logger.info(
            {
                userId: payload.userId,
            },
            "User Logged Out"
        );
    }

    async changePassword(userId:string,data:ChangePasswordDto){
        
        const user = await this.userRepository.findByIdWithPassword(userId);

        if(!user){
            throw new UnauthorizedError("User not found");
        }
        
        const isMatch = await bcrypt.compare(data.currentPassword,user.password);
        
        if(!isMatch){
            throw new UnauthorizedError("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);
        await this.userRepository.updatePassword(userId, hashedPassword);

        await this.refreshTokenRepository.deleteAllByUserId(userId);
        
        logger.info(
            {
                userId: userId,
            },
            "User Password Changed"
        );
    }

}
