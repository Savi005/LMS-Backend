import { User } from "../models/user.model";
import { RegisterDto } from "../dtos/auth.dto";

export class UserRepository {

    async findByEmail(email:string){
        return User.findOne({email});
    }

    async create(data:RegisterDto){

        return User.create(data);

    }

    async findByEmailWithPassword(email:string){
        return User.findOne({email}).select("+password");
    }

}