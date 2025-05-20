import mongoose from 'mongoose'
import {__dirname} from './app.js'
import dotenv from 'dotenv'
import { server } from './Socket/index.js'

dotenv.config({path:`${__dirname}/config.env`})
mongoose.connect(process.env.DATA_BASE).then(()=>{
    console.log('db is connected')
}).catch((err)=>{
    console.log(err)
})

server.listen(process.env.PORT,()=>{
    console.log('server is running')
})