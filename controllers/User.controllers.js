import asyncHandler from "../utils/asyncHandler.js";
import ApiResponce from "../utils/apiResponce.js";
import ApiError from "../utils/apiError.js";
import User from "../models/User.js";

export const registerUser = asyncHandler(async (req , res)=>{
    const {username , email , password } = req.body;

    const checkExistingUser = await User.findOne({email});

    if(checkExistingUser){
        throw new ApiError("User already Exists" , 400)
    }

    const newUser = await User.create(
        {
            username,
            email,
            password
        }
    )
    return res 
    .status(201)
    .json(new ApiResponce(201 , "User registered successfully" , newUser))
})

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Send success response
  return res
    .status(200)
    .json(new ApiResponce(200, "Logged in successfully", user));
});

