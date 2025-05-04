import { catchError,HandleERROR } from "vanta-api";
import express from 'express'
import cors from 'cors'
import morgan from "morgan";
import path from 'path'
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)

const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.static('Public'))






app.use('/api/upload')
app.use('*',(req,res,next)=>{
    return next(new HandleERROR('route not found',404))
})
app.use(catchError)