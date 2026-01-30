import Profile from "../models/UserProfile";

export const createUserProfile = async (req, res)=>{

   try{
     const {profileImage, bio, qualification, post} = req.body;

    if(!profileImage || !bio || !qualification || !post){
        return res.status(400).json({
            success:false,
            message:"Please fill in all the required fields"
        })
    }

    const image = req.file;

    const newProfile = new Profile({
        profileImage,
        bio,
        qualification,
        post,
        date: new Date(),
    })

    await newProfile.save();

    res.status(201).json({
        success:true,
        message:"Profile created successfully!!"
    })
   }catch(error){
    res.status(500).json({
        success:false,
        message:"Something went wrong while creating profile. Please try again later."
    })
   }
}