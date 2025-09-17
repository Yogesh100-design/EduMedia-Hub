import asyncHandler from "../utils/asyncHandler";
import ApiResponce from "../utils/apiResponce";
import ApiError from "../utils/apiError";
import User from "../models/User";

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
})