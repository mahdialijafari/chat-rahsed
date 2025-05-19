
import { catchAsync, HandleERROR } from "vanta-api";
import Chat from "../Models/chatMd.js";
import User from "../Models/userMd.js";

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


