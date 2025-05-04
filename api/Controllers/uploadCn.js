import { catchAsync, HandleERROR } from "vanta-api";
import { __dirname } from "../app.js";

export const uploadCn = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new HandleERROR("UPLOAD failed", 400));
  }
  return res.status(201).json({
    success:true,
    file: file,
  });
});
