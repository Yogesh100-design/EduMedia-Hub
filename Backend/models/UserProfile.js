import mongoose, { Schema } from "mongoose";

const userProfileScema = new Schema({
  profileImage: {
    type: String,
  },
  bio: {
    type: String,
  },
  qualification: {
    type: String,
  },
  post: {
    type: mongoose.type.objectId,
    ref: "post",
  },
},{timestamps:true});

const Profile = mongoose.model("Profile",userProfileScema);
export default Profile;
