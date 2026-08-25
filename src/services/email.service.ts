import { IEmailService } from "../interfaces/email-service.interface";

export class EmailService implements IEmailService {
  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    console.log(
      `Password reset token for ${email}: ${resetToken}`
    );
  }
}