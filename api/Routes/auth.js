import express from  'express'
import { auth, checkOtp, resendCode } from '../Controllers/authCn.js'
const authRouter=express.Router()
authRouter.route('/').post(auth)
authRouter.route('/otp').post(checkOtp)
authRouter.route('/resend').post(resendCode)

export default authRouter
