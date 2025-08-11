// controllers/venue.controller.js
import { Venue } from "../models/venue.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { APIError } from "../utils/ApiError.js";

export const createVenue = asyncHandler(async (req, res) => {
  const { name, location, description, venueType, sportsTypes, amenities, about, photos } = req.body;

  if (!name || !location?.address || !location?.city || !location?.state || !location?.pincode) {
    throw new APIError(400, "All required location fields must be provided");
  }

  const venue = await Venue.create({
    ownerId: req.user._id,
    name,
    location,
    description,
    venueType,
    sportsTypes,
    amenities,
    about,
    photos
  });

  res.status(201).json(new APIResponse(201, venue, "Venue created successfully"));
});

export const getAllVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find({ status: "approved" }).populate("ownerId", "fullName email");
  res.status(200).json(new APIResponse(200, venues, "Venues fetched successfully"));
});

export const getVenueById = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id).populate("ownerId", "fullName email");
  if (!venue) throw new APIError(404, "Venue not found");

  res.status(200).json(new APIResponse(200, venue, "Venue fetched successfully"));
});

export const updateVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!venue) throw new APIError(404, "Venue not found or not owned by you");

  Object.assign(venue, req.body);
  await venue.save();

  res.status(200).json(new APIResponse(200, venue, "Venue updated successfully"));
});


export const deleteVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!venue) throw new APIError(404, "Venue not found or not owned by you");

  res.status(200).json(new APIResponse(200, null, "Venue deleted successfully"));
});