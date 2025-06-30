import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
  type: {
    type: String,
    default: "text",
    enum: ["text", "image", "video", "audio", "file"],
  },

  seenBy: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  content: {
    type: [string],
    required: [true, "content is required"],
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Message = mongoose.model("Message", messageSchema);
export default Message;
