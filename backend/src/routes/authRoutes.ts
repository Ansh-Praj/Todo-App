import Router from 'express'
import prisma from '../prisma.js'
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'

const authRouter = Router()

authRouter.post('/signup', async(req, res)=>{
    const {username, password} = req.body
    

    const hashedPassword = bcrypt.hashSync(password, 8)

    try{
        const user = await prisma.users.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {expiresIn: "24h"})
    
        res.json({ token });
    } 
    catch(err:any){
        if(err.code==='P2002'){
            return res.status(400).json({message: "Username Already Exists!"})
        }

        console.error(err);
        
        res.status(500).json({message: "Internal Server Error" });
    }
})

authRouter.post('/login', async (req, res)=>{
    const {username, password} = req.body

    try{
        const user = await prisma.users.findUnique({
            where: {
                username,
            }
        })

        if(!user) {
            res.status(404).json({message: "User not found"})
            return
        }

        const isValid = bcrypt.compareSync(password, user?.password)

        if(!isValid){
            res.status(401).json({message: "Invalid Password"})
            return
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {expiresIn: "24h"})
    
        res.json({ token });
    } 
    catch(e){
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default authRouter
