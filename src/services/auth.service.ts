import bcrypt from "bcrypt";
import { RegisterDto, UserResponseDto } from "../dtos/auth.dto";
import { ConflictError } from "../errors/ConflictError";
import { UserRepository } from "../repositories/user.repository";
import { logger } from "../config/logger";

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

}