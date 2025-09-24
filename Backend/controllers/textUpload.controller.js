import asyncHandler from "../utils/asyncHandler.js";
import ApiResponce from "../utils/apiResponce.js";
import ApiError from "../utils/apiError.js";
import Text from "../models/text.js";

// Upload text
export const uploadText = asyncHandler(async (req, res) => {
  const { title, content, uploadedBy } = req.body;

  // Validate
  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  // Save to DB
  const newText = await Text.create({
    title,
    content,
    uploadedBy: uploadedBy || "anonymous",
  });

  return res
    .status(201)
    .json(new ApiResponce(201, "Text uploaded successfully", newText));
});
