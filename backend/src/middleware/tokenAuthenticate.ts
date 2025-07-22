import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const tokenAuthenticate = ((req: Request, res: Response, next: NextFunction)=>{
    const token = req.headers.authorization

    if(!token){
        res.status(401).json({message: "Missing or invalid token"})
        return 
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: string}
        req.userId = decoded.id
        next()
    }
    catch(e){
        res.status(401).json({message: "Unauthorized"})
        return
    }


})

// As normal request object doesn't have userId property we tell TS that it has this property
declare global {
    namespace Express {
      export interface Request {
        userId: string;
      }
    }
}