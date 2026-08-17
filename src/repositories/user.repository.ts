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
}