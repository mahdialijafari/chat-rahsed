import { catchAsync,HandleERROR } from "vanta-api";
import User from "../Models/userMd.js";

export const getOne=catchAsync(async (req,res,next)=>{
    const data=await User.findById(req.userId)
    return res.status(200).json({
        success:true,
        data
    })
})

export const update=catchAsync(async (req,res,next)=>{
    const {phoneNumber=null,...others}=req.body
    const data=await User.findByIdAndUpdate(req.userId,others,{new:true,runValidators:true})
    return res.status(200).json({
        success:true,
        data,
        message:'updated successfully'
    })
})

export const remove=catchAsync(async (req,res,next)=>{
    const data=await User.findByIdAndDelete(req.userId)
    return res.status(200).json({
        success:true,
        data,
        message:'removed successfully'
    })
})