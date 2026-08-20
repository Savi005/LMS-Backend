import { User } from "../models/user.model";
import type { RegisterDto } from "../dtos/auth.dto";
import type { IUserRepository } from "../interfaces/repositories/user.repository.interface";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async create(data: RegisterDto) {
    return User.create(data);
  }

  async findByEmailWithPassword(email: string) {
    return User.findOne({ email }).select("+password");
  }
  async findById(id: string) {
    return User.findById(id);
  }

  async findByIdWithPassword(id: string) {
    return User.findById(id).select("+password");
  }

  async updatePassword(userId: string, hashedPassword: string) {
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
  }
}