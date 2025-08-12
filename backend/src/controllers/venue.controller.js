// controllers/venue.controller.js
import { Venue } from "../models/venue.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



export const createVenue = asyncHandler(async (req, res) => {
  const { name, location, description, venueType, sportsTypes, amenities, about } = req.body;

  if (!name || !location?.address || !location?.city || !location?.state || !location?.pincode) {
    throw new ApiError(400, "All required location fields must be provided");
  }

  // Upload photos to Cloudinary
  let uploadedPhotos = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
    const uploadResults = await Promise.all(uploadPromises);
    uploadedPhotos = uploadResults.map(result => result?.secure_url).filter(Boolean);
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
    photos: uploadedPhotos
  });

  res.status(201).json(new ApiResponse(201, venue, "Venue created successfully"));
});
export const getAllVenues = asyncHandler(async (req, res) => {
  const venues = await Venue.find({ status: "approved" }).populate("ownerId", "fullName email");

  res.status(200).json(new ApiResponse(200, venues, "Venues fetched successfully"));
});

export const getVenueById = asyncHandler(async (req, res) => {
  const venue = await Venue.findById(req.params.id).populate("ownerId", "fullName email");
  if (!venue) throw new ApiError(404, "Venue not found");

  res.status(200).json(new ApiResponse(200, venue, "Venue fetched successfully"));
});

export const updateVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findOne({ _id: req.params.id, ownerId: req.user._id });
  if (!venue) throw new ApiError(404, "Venue not found or not owned by you");

  Object.assign(venue, req.body);
  await venue.save();

  res.status(200).json(new ApiResponse(200, venue, "Venue updated successfully"));
});


export const deleteVenue = asyncHandler(async (req, res) => {
  const venue = await Venue.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
  if (!venue) throw new ApiError(404, "Venue not found or not owned by you");

  res.status(200).json(new ApiResponse(200, null, "Venue deleted successfully"));
});
export const getAllVenuesByOwner = asyncHandler(async (req, res) => {
  const ownerId = req.user._id
  const venues = await Venue.find({ status: "approved", ownerId }).populate(
    "ownerId",
    "fullName email"
  )

  res
    .status(200)
    .json(new ApiResponse(200, venues, "Venues fetched successfully"))
})

export const searchVenuesByCity = asyncHandler(async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ status: "fail", message: "City is required" });
  }

  // Case-insensitive search by city in location object
  const venues = await Venue.find({
    "location.city": { $regex: city, $options: "i" },
    status: "approved", // optional filter to only approved venues
  });

  res.json({
    status: "success",
    results: venues.length,
    data: venues,
  });
});