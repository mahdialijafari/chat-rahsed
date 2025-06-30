import { catchError,HandleERROR } from "vanta-api";
import express from 'express'
import cors from 'cors'
import morgan from "morgan";
import path from 'path'
import { fileURLToPath } from "url";
import uploadRouter from "./Routes/upload.js";
import authRouter from "./Routes/auth.js";
import jwt from "jsonwebtoken";
import userRouter from "./Routes/user.js";

const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)

const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.static('Public'))
app.use((req,res,next)=>{
    try {
        const {id}=jwt.verify(req.headers.authorization.split(' ')[1],process.env.SECRET_JWT)
        req.userId=id
        next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'you must be login'
        })
    }
})




app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/upload',uploadRouter)
app.use((req,res,next)=>{
    return next(new HandleERROR('route not found',404))
})
app.use(catchError)


export default app;
