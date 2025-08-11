import { User } from "../models/user.model.js";

import { Venue } from "../models/venue.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { _id: 1, createdAt: 1 }).lean();

  return res.status(200).json(
    new ApiResponse(200, users, "Users info fetched")
  );
});

export const getPendingVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find({ status: "pending" })
    .populate("ownerId");
console.log(venues)
  res.status(200).json(
    new ApiResponse(200, venues, "Pending venues fetched successfully")
  );
});

export const approveVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, venue, "Venue approved successfully"));
});

// Reject venue
export const rejectVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, venue, "Venue rejected successfully"));
});