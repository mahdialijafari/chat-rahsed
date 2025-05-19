import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "username is already taken"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "username is required"],
    unique: [true, "username is already taken"],
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  chatList:{
    type:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Chat'
    }]
  }
});
const User = mongoose.model("User", userSchema);
export default User;
