import Message from "../Models/messageMd.js";
import Chat from "../Models/chatMd.js";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
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
        messages:message._id
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

export const getMessage=catchAsync(async(req,res,next)=>{
    const {chatId}=req.params
    const chat=Chat.findById(chatId)
    if(chat.members.includes(req.userId)){
        return next(new HandleERROR('you are not member of this chat',403))
    }
    const features=new ApiFeatures(Message,req.query,'user')
    .addManualFilters({chatId})
    .filter()
    .sort()
    .paginate()
    .limitFields()
    .populate([{
        path:'senderId',
        select:'username phoneNumber'
    },{
        path:'chatId',
    },{
        path:'seenBy',
        select:'username phoneNumber'
    }])
    const data=await features.execute()
    for(const message of data.data){
        const seen=message.seenby.includes(req.userId)
        if(!seen){
            message.seenby.push(req.userId)
            await message.save()
        }
    }
    return res.status(200).json(data)
})

export const updateMesseage=catchAsync(async(req,res,next)=>{
    const {chatId}=req.body
    
})