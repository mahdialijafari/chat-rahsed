import mongoose from 'mongoose'
import app,{__dirname} from './app.js'
import dotenv from 'dotenv'

dotenv.config({path:`${__dirname}/config.env`})
mongoose.connect(process.env.DATA_BASE).then(()=>{
    console.log('db is connected')
}).catch((err)=>{
    console.log(err)
})

app.listen(process.env.PORT,()=>{
    console.log('server is running')
})