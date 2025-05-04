import express from "express";
import upload from "../Utils/uploadFile.js";
import { uploadCn } from "../Controllers/uploadCn.js";
const uploadRouter = express.Router();

uploadRouter.route("/").post(upload.single("file"), uploadCn);

export default uploadRouter;
