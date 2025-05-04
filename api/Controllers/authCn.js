import jwt from "jsonwebtoken";
import User from "../Models/userMd.js";
import { catchAsync, HandleERROR } from "vanta-api";
import { sendAuthCode, verifyCode } from "../Utils/smsHandler.js";
export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) {
    return next(new HandleERROR("phone is required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  const resultSms = await sendAuthCode(phoneNumber);
  if (resultSms?.success) {
    return res.status(200).json({
      success: true,
      newAccount: user?._id ? false : true,
      message: "code sent",
    });
  } else {
    return res.status(404).json({
      success: false,
      newAccount: user?._id ? false : true,
      message: resultSms.message,
    });
  }
});
export const checkOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, code = null, newAccount = "unknown" } = req.body;
  if (!phoneNumber || !code || newAccount == "unknown") {
    return next(
      new HandleERROR("phone and newAccount and password is required", 400)
    );
  }
  const verifyResult = await verifyCode(phoneNumber, code);
  if (!verifyResult.success) {
    return next(new HandleERROR("invalid code", 400));
  }
  let user;

  if (newAccount == "true") {
    user = await User.create({ phoneNumber });
  } else {
    user = await User.findOne({ phoneNumber });
  }
  const token = jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber },
    process.env.SECRET_JWT
  );
  return res.status(200).json({
    success: true,
    data: {
      user,
      token,
    },
    message:
      newAccount == "true" ? "register successfully" : "login successfully",
  });
});

export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) {
    return next(new HandleERROR("phone is required", 400));
  }
  const resultSms = await sendAuthCode(phoneNumber);
  return res.status(200).json({
    success: resultSms.success,
    message: resultSms.success ? "code sent" : resultSms?.message,
  });
});
