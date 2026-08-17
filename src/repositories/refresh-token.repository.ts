import {
  RefreshTokenModel,
  type RefreshTokenDocument,
} from "../models/refresh-token.model";

import type { IRefreshTokenRepository } from "../interfaces/repositories/refresh-token.repository.interface";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<RefreshTokenDocument> {
    return RefreshTokenModel.create({
      userId,
      tokenHash,
      expiresAt,
    });
  }

  async findByTokenHash(
    tokenHash: string
  ): Promise<RefreshTokenDocument | null> {
    return RefreshTokenModel.findOne({
      tokenHash,
    });
  }

  async deleteById(id: string): Promise<void> {
    await RefreshTokenModel.findByIdAndDelete(id);
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.deleteMany({
      userId,
    });
  }
}