import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController{

    constructor(
        private service:AuthService
    ){}

    register=async(
        req:Request,
        res:Response,
        next:NextFunction
    )=>{

        try{

            const user=await this.service.register(req.body);

            res.status(201).json({

                success:true,
                message:"User registered successfully",
                data:user

            });

        }

        catch(error){

            next(error);

        }

    };

}