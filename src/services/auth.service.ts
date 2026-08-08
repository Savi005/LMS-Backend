import bcrypt from "bcrypt";
import { LoginDto, RegisterDto, UserResponseDto } from "../dtos/auth.dto";
import { ConflictError } from "../errors/ConflictError";
import { UserRepository } from "../repositories/user.repository";
import { logger } from "../config/logger";
import { generateAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../errors/UnauthorizedError";

export class AuthService {

    constructor(
        private repository:UserRepository
    ){}

    async register(data:RegisterDto):Promise<UserResponseDto>{

        const existingUser=await this.repository.findByEmail(data.email);

        if(existingUser){
            throw new ConflictError("Email already exists");
        }

        const hashedPassword=await bcrypt.hash(data.password,10);

        const user=await this.repository.create({
            ...data,
            password:hashedPassword
        });

        logger.info({
            email:user.email
        },"User Registered");

        return{

            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role

        };

    }

async login(data: LoginDto){ 
  const user = await this.repository.findByEmailWithPassword(data.email);

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = generateAccessToken(
    user.id,
    user.role
  );

  return {
    accessToken: token,
  };
}

}