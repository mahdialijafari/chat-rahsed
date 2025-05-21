import mongoose from "mongoose";

const removeSchema=new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  removedAt:{
    type:Date,
    default:Date.now
  }
})

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
  },
  name: {
    type: String,
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
  removedMember:{
    type: [removeSchema],
    default:[]
  }, messages:{
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    default: [],
  }
},{timestamps:true});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
