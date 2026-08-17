import type { RefreshTokenDocument } from "../../models/refresh-token.model";

export interface IRefreshTokenRepository {
  create(
    userId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<RefreshTokenDocument>;

  findByTokenHash(
    tokenHash: string
  ): Promise<RefreshTokenDocument | null>;

  deleteById(id: string): Promise<void>;

  deleteAllByUserId(userId: string): Promise<void>;
}