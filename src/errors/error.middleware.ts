import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../config/logger";

export const errorHandler=(

err:Error,
req:Request,
res:Response,
next:NextFunction

)=>{

logger.error(err);

if(err instanceof AppError){

return res.status(err.statusCode).json({

success:false,
message:err.message

});

}

return res.status(500).json({

success:false,
message:"Internal Server Error"

});

};