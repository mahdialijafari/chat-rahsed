
import { catchAsync, HandleERROR } from "vanta-api";
import Chat from "../Models/chatMd.js";
import User from "../Models/userMd.js";
import { io,getSocketId } from "../Socket/index.js";
import { Types } from "mongoose";

export const createPrivate = catchAsync(async (req, res, next) => {
  const {userId} = req.body;
  const userChats=await User.findById(userId).populate('chatList')
  let isExist=false
  let oldChatId;
  const myChat=userChats?.chatList.filter(chat=>{
    if(chat.type!='private'){
      return false
    }
    let removedisExist=false
    chat.members?.map((e)=>{
      if(String(e)==String(req?.userId)){
        isExist=true
        oldChatId=chat._id
      }
    })
    chat.removedMembers?.map((e)=>{
      if(String(e.userId)==String(req?.userId)){
        removedisExist=true
      }
    })
    return removedisExist
  })
  if(isExist){
    return res.status(400).json({message:'chat already exists',data:{chatId:oldChatId}})
  }
  if(myChat?.length==0){
    const newChat=await Chat.create({type:'private',members:[userId,req.userId]}) 
    userChats.chatList.push(newChat._id)
    await userChats.save()
    await User.findByIdAndUpdate(req.userId,{$push:{chatList:newChat._id}},{new:true})
    const socketId=getSocketId(req.userId)
    if(socketId){
      io.to(socketId).emit('newChat',newChat)
    }
    res.status(200).json({
      success: true,
      data: {
        chats:newChat
      },
    });
  }
  const chat=await Chat.findByIdAndUpdate(myChat[0]._id,{$push:{members:req.userId}})
  await User.findByIdAndUpdate(req.userId,{$push:{chatList:chat[0]._id}},{new:true})
  res.status(200).json({
    success: true,
    data: {
      chats:chat
    },
  });
});

export const createChannelOrGroup = catchAsync(async (req, res, next) => {
  const {type=null,chatName=null,name=null}=req.body
  if(!type || !chatName || !name){
    return next(new HandleERROR('bad req',404))
  }
  const chat=await Chat.find({chatName})
  if(chat.length>0){
    return next(new HandleERROR('chat name already taken',400))
  }
  const newChat=await Chat.create({type,chatName,name,owner:req.userId,members:[req.userId],admins:[req.userId]})
  await User.findByIdAndUpdate(req.userId,{$push:{chatList:newChat._id}},{new:true})
  res.status(201).json({
    success: true,
    message: 'create successfully',
    data: newChat,
  });
});


export const getMyChats=catchAsync(async(req,res,next)=>{
  const userChats=await User.aggregate([
    {
      $match:{
        _id:new Types.ObjectId(req.userId)
      }
    },
    {
      $lookup:{
        from:'chats',
        localField:'chatList',
        foreignField:'_id',
        as:'chats'
      }
    }
  ])
  const result=userChats[0] || {chatList:[]}
  return res.status(200).json({
    success:true,
    data:{
      chats:result.chatList
    }
  })
})

export const addMember=catchAsync(async(req,res,next)=>{
  const {chatId=null,userId=null}=req.body
  if(!chatId || !userId){
    return next(new HandleERROR('chat ID and user ID is required',400))
  }
  const chat=await Chat.findById(chatId)
  if(!chat){
    return next(new HandleERROR('chat not found',404))
  }
  if(chat.type=='private'){
    return next(new HandleERROR('private chat cannot add member',400))
  }
  if(!chat.admins.includes(req.userId)){
    return next(new HandleERROR('you are not admin of this chat',403))
  }
  if(chat.members.includes(userId)){
    return next(new HandleERROR('user is already a member',400))
  }
  chat.members.push(userId)
  await chat.save()
  const socketId=getSocketId(userId)
    if(socketId){
      io.to(socketId).emit('newChat',chat)
    }
  return res.status(200).json({
    success:true,
    data:{
      chat
    }
  })
})

export const addAdmin=catchAsync(async(req,res,next)=>{
  const {chatId=null,userId=null}=req.body
  if(!chatId || !userId){
    return next(new HandleERROR('chat ID and user ID is required',400))
  }
  const chat=await Chat.findById(chatId)
  if(!chat){
    return next(new HandleERROR('chat not found',404))
  }
  if(chat.type=='private'){
    return next(new HandleERROR('private chat cannot add member',400))
  }
  if(chat.owner != req.userId){
    return next(new HandleERROR('you are not admin of this chat',403))
  }
  if(!chat.members.includes(userId)){
    return next(new HandleERROR('user was not a member',400))
  }
  chat.admins.push(userId)
  await chat.save()
  return res.status(200).json({
    success:true,
    data:{
      chat
    }
  })
})

export const removeAdmin=catchAsync(async(req,res,next)=>{
  const {chatId=null,userId=null}=req.body
  if(!chatId || !userId){
    return next(new HandleERROR('chat ID and user ID is required',400))
  }
  const chat=await Chat.findById(chatId)
  if(!chat){
    return next(new HandleERROR('chat not found',404))
  }
  if(chat.type=='private'){
    return next(new HandleERROR('private chat cannot add member',400))
  }
  if(chat.owner != req.userId){
    return next(new HandleERROR('you are not admin of this chat',403))
  }
  if(!chat.members.includes(userId)){
    return next(new HandleERROR('user was not a member',400))
  }
  const newAdmins=chat.admins.filter(admin=>admin!==userId)
  chat.admins=newAdmins
  const newChat=await chat.save()
  const socketId=getSocketId(userId)
    if(socketId){
      io.to(socketId).emit('adminRemoved',chat)
    }
  return res.status(200).json({
    success:true,
    data:{
      newChat
    }
  })
})

export const removeMember=catchAsync(async(req,res,next)=>{
  const {chatId=null,userId=null}=req.body
  if(!chatId || !userId){
    return next(new HandleERROR('chat ID and user ID is required',400))
  }
  const chat=await Chat.findById(chatId)
  if(!chat){
    return next(new HandleERROR('chat not found',404))
  }
  if(chat.type=='private'){
    return next(new HandleERROR('private chat cannot add member',400))
  }
  if(chat.owner != req.userId && !chat.admins.includes(req.userId)){
    return next(new HandleERROR('you are not admin of this chat',403))
  }
  if(!chat.members.includes(userId)){
    return next(new HandleERROR('user was not a member',400))
  }
  const newMember=chat.members.filter(member=>member!==userId)
  chat.member=newMember
  const newChat=await chat.save()
  const socketId=getSocketId(userId)
    if(socketId){
      io.to(socketId).emit('memberRemoved',chat)
    }
  return res.status(200).json({
    success:true,
    data:{
      newChat
    }
  })
})
