import {prisma} from "../lib/db_init.js"
import type { Request , Response ,NextFunction } from "express"
import jwt  from "jsonwebtoken";

export const verifyJwt=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"invalid token"
            })
        }
        const decoded=jwt.verify(token,process.env.TOKEN_SECRET_KEY!) as  {user_id:string};
        req.userId=decoded.user_id;
        return next();
    }
    catch(error){
        return res.status(500).json({
            message : "invalid authentication"
        })
    }
}