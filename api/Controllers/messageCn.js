import Message from "../Models/messageMd.js";
import Chat from "../Models/chatMd.js";
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
        $push:{messages:message._id}
    })
    const socketIds=getSocketId(chat.members)
    socketIds.forEach((socketId) => {
        io.to(socketId).emit('new_message',message)
    });
    return res.status(201).json({
        success:true,
        data:message,
        message:'send message successfully'
    })
})

export const updateMesseage=catchAsync(async(req,res,next)=>{
    const {chatId}=req.body
    
})