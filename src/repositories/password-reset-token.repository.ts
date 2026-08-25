import {
  PasswordResetTokenModel,
  type PasswordResetTokenDocument,
} from "../models/password-reset-token.model";

import type { IPasswordResetTokenRepository } from "../interfaces/repositories/password-reset-token.repository.interface";

export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
    
async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<PasswordResetTokenDocument> {
    return PasswordResetTokenModel.create({
      userId,
      tokenHash,
      expiresAt,
    });
  }

  async findByTokenHash(
    tokenHash: string
  ): Promise<PasswordResetTokenDocument | null> {
    return PasswordResetTokenModel.findOne({
      tokenHash,
    });
  }
  
  async deleteById(id: string): Promise<void> {
    await PasswordResetTokenModel.findByIdAndDelete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await PasswordResetTokenModel.deleteMany({
      userId,
    });
  }
}