import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ChangePasswordDto, RefreshTokenDto } from "../dtos/auth.dto";
import { ForgotPasswordDto } from "../dtos/forgot-password.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.register(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.service.login(req.body);

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: token,
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as RefreshTokenDto;

      const tokens = await this.service.refresh(data);

      res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as RefreshTokenDto;

      await this.service.logout(data);

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ChangePasswordDto;

      await this.service.changePassword(req.user!.userId, data);

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as ForgotPasswordDto;

      await this.service.forgetPassword(data);

      res.status(200).json({
        success: true,
        message:
          "If an account exists for this email, a password reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  };
  async resetPassword(req: Request, res: Response): Promise<void> {
    const dto: ResetPasswordDto = req.body;

    await this.service.resetPassword(dto);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  }
}
