import asyncHandler from "../utils/asyncHandler.js";
import ApiResponce from "../utils/apiResponce.js";
import ApiError from "../utils/apiError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const registerUser = asyncHandler(async (req , res)=>{
    const {username , email , password , role } = req.body;

    if (!["student","teacher","alumni","mentor"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

    const checkExistingUser = await User.findOne({email});

    if(checkExistingUser){
        throw new ApiError("User already Exists" , 400)
    }

    const newUser = await User.create(
        {
            username,
            email,
            password,
            role
        }
    )
    return res 
    .status(201)
    .json(new ApiResponce(201 , "User registered successfully" , newUser ))
})


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password , role } = req.body;

  // Check required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  // Find user by email
  const user = await User.findOne({ email , role });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "15m" } // Access token valid for 15 minutes
  );

  const refreshToken = jwt.sign(
    { userId: user._id }, 
    process.env.REFRESH_SECRET, 
    { expiresIn: "7d" } // Refresh token valid for 7 days
  );

  // Optionally, store refresh token in DB or HTTP-only cookie
  // Example using cookie:
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send response
  return res.status(200).json(
  new ApiResponce(200, "Logged in successfully", {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role, // 👈 add this
    },
    accessToken,
  })
);

});

export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logged out successfully ✅",
  });
});


