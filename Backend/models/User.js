import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role:{
      type : String,
      enum: ["student", "teacher", "alumni", "mentor"],
      required:true
    },
    profileImg:{
      type:String
    },
    bio:{
      type: String
    }
    
  },
  { timestamps: true }
);

// ✅ Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password changed
  this.password = await bcrypt.hash(this.password, 10); // 10 salt rounds
  next();
});

// ✅ Method to compare passwords (useful in login)
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
