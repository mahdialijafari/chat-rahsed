import Message from "../Models/messageMd";
import Chat from "../Models/chatMd";
import { catchAsync, HandleERROR } from "vanta-api";
import {io, getSocketId} from '../Socket/index.js'

export const createMessage=catchAsync(async(req,res,next)=>{
    const {content,chatId,type}=req.body
    const message=await Message.create({
        content,
        chatId,
        type,
        senderId:req.userId,
        seenby:[req.userId]
    })
    const chat=await Chat.findByIdAndUpdate(chatId,{
        $push:{message:message._id}
    })
})

export const updateMesseage=catchAsync(async(req,res,next)=>{
    const {chatId}=req.body
    
})