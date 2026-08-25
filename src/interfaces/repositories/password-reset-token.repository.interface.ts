import type { PasswordResetTokenDocument } from "../../models/password-reset-token.model";

export interface IPasswordResetTokenRepository {
    create(
        userId: string,
        tokenHash: string,
        expiresAt: Date
    ): Promise<PasswordResetTokenDocument>;

    findByTokenHash(
        tokenHash: string
    ): Promise<PasswordResetTokenDocument | null>;
    
    deleteById(id: string): Promise<void>;

    deleteByUserId(userId: string): Promise<void>;
}

