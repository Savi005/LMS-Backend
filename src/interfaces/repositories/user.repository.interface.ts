import type { RegisterDto } from "../../dtos/auth.dto";
import type { UserDocument } from "../../models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDocument | null>;

  findByEmailWithPassword(email: string): Promise<UserDocument | null>;

  create(data: RegisterDto): Promise<UserDocument>;

  findById(id: string): Promise<UserDocument | null>;

  findByIdWithPassword(id: string): Promise<UserDocument | null>;

  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}