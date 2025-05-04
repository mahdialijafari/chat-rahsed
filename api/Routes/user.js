import express from "express";
import { getOne, remove, update } from "../Controllers/userCn.js";
const userRouter=express.Router()
userRouter.route('/').get(getOne).patch(update).delete(remove)

export default userRouter