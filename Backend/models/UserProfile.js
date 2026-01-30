import mongoose, { Schema } from "mongoose";
import Post from "./post.js"

const userProfileScema = new Schema({
    user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    unique:true
    },
  profileImage: {
    type: String,
  },
  bio: {
    type: String,
  },
  qualification: {
    type: String,
  },
  post: [
    {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
]
},{timestamps:true});

const Profile = mongoose.model("Profile",userProfileScema);
export default Profile;
