import jwt from "jsonwebtoken";

export function generateAccessToken(
    id:string,
    role:String
){
    return jwt.sign({id, role},
         process.env.JWT_ACCESS_SECRET!, 
         {expiresIn:"15m"});
}

export function generateRefreshToken(
    id:string,
){
    return jwt.sign({id},
            process.env.JWT_REFRESH_SECRET!, 
            {expiresIn:"7d"});
            
}