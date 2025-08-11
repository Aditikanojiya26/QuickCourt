import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { _id: 1, createdAt: 1 }).lean();

  // Respond with ApiResponse format
  return res.status(200).json(
    new ApiResponse(200, users, "Users info fetched")
  );
});
