import post from "../models/post.js";
import Profile from "../models/UserProfile.js";

export const createUserProfile = async (req, res) => {
  try {
    const { bio, qualification } = req.body;
    const userId = req.user._id; // from auth middleware

    if (!bio || !qualification) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the required fields",
      });
    }

    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await Profile.create({
      user: userId,
      profileImage: req.file?.path,
      bio,
      qualification,
    });

    res.status(201).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating profile",
    });
  }
};

export const getUserProfileWithPost = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await Profile.findOne({ userId }).populate(
      "user",
      "name email",
    );

    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: "profile not found",
      });
    }

    const post = await post.find({ userId }).sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "User post fetch successfull !!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching the posts. Please try after some time",
    });
  }
};
