import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    unique: [true, "username is already taken"],
  },
  type: {
    type: String,
    required: [true, "type is required"],
    enum: ["group", "channel", "private"],
  },
  members: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  admins: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
