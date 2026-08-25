export interface IEmailService {
  sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void>;
}