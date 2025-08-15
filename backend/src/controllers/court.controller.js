import mongoose from "mongoose"
import { Court } from "../models/court.model.js"
import { Venue } from "../models/venue.model.js" // Assuming you have a Venue model
import { asyncHandler } from "../utils/asyncHandler.js" // A wrapper for async functions
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const createCourt = asyncHandler(async (req, res) => {
  // Expect an array of court objects from the request body
  const { courts } = req.body

  // 1. --- Validate the incoming batch ---
  if (!Array.isArray(courts) || courts.length === 0) {
    throw new ApiError(
      400,
      "Request body must contain a non-empty array of courts."
    )
  }

  // Get the venueId from the first court and validate it once for the whole batch.
  const venueId = courts[0]?.venueId
  if (!venueId || !isValidObjectId(venueId)) {
    throw new ApiError(400, "A valid Venue ID is required for all courts.")
  }

  // Check if the venue exists once for the whole batch
  const venue = await Venue.findById(venueId)
  if (!venue) {
    throw new ApiError(404, `Venue with ID ${venueId} not found`)
  }

  // 2. --- Validate each court and check for duplicates ---
  const courtNamesInRequest = new Set()
  for (const court of courts) {
    // Check for required fields in each court object
    if (!court.name || !court.sportsType || !court.venueId) {
      throw new ApiError(
        400,
        `Each court must have a name, sportsType, and venueId.`
      )
    }
    // Ensure all courts in the batch belong to the same venue
    if (court.venueId !== venueId) {
      throw new ApiError(
        400,
        "All courts in a single request must belong to the same venue."
      )
    }
    // Check for duplicate names within the request itself to prevent errors
    if (courtNamesInRequest.has(court.name)) {
      throw new ApiError(
        409,
        `Duplicate court name "${court.name}" found in the request. Please use unique names.`
      )
    }
    courtNamesInRequest.add(court.name)
  }

  // Check for duplicate names against what's already in the database for this venue
  // const existingCourts = await Court.find({
  //   venueId,
  //   name: { $in: Array.from(courtNamesInRequest) },
  // })
  // if (existingCourts.length > 0) {
  //   const existingNames = existingCourts.map((c) => c.name).join(", ")
  //   throw new ApiError(
  //     409,
  //     `The following court names already exist in this venue: ${existingNames}.`
  //   )
  // }

  // 3. --- Create and Save the New Courts ---
  // Use insertMany for efficient bulk database insertion
  const createdCourts = await Court.insertMany(courts)

  if (!createdCourts || createdCourts.length === 0) {
    throw new ApiError(500, "Something went wrong while creating the courts.")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdCourts,
       ` ${createdCourts.length} courts created successfully.`
      )
    )
})

const getAllCourts = asyncHandler(async (req, res) => {
  const { venueId } = req.query
  const filter = venueId ? { venueId } : {}

  const courts = await Court.find(filter).populate("venueId", "name location")

  return res
    .status(200)
    .json(new ApiResponse(200, courts, "Courts retrieved successfully."))
})

const getCourtById = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid Court ID format.")
  }

  const court = await Court.findById(id).populate("venueId", "name")
  if (!court) {
    throw new ApiError(404, "Court not found.")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, court, "Court retrieved successfully."))
})

const updateCourt = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, sportsType, operatingHours } = req.body

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid Court ID format.")
  }

  const updatedCourt = await Court.findByIdAndUpdate(
    id,
    { $set: { name, sportsType, operatingHours } },
    { new: true, runValidators: true }
  )

  if (!updatedCourt) {
    throw new ApiError(404, "Court not found.")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCourt, "Court updated successfully."))
})

const deleteCourt = asyncHandler(async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid Court ID format.")
  }

  const court = await Court.findByIdAndDelete(id)

  if (!court) {
    throw new ApiError(404, "Court not found.")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Court deleted successfully."))
})
const getAllCourtsByOwner = asyncHandler(async (req, res) => {
  // 1. Get the owner's ID from the request (set by your authentication middleware)
  const ownerId = req.user?._id

  if (!ownerId) {
    throw new ApiError(401, "User not authenticated")
  }

  // 2. Find all venues owned by this user to get their IDs
  const venues = await Venue.find({ ownerId: ownerId }).select("_id")

  // If the owner has no venues, they have no courts. Return an empty array.
  if (!venues || venues.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Owner has no venues or courts."))
  }

  // 3. Extract just the IDs from the venue documents
  const venueIds = venues.map((venue) => venue._id)

  // 4. Find all courts where the venueId is in the list of the owner's venue IDs
  // We also populate the venue's name to be useful for the frontend table.
  const courts = await Court.find({ venueId: { $in: venueIds } }).populate(
    "venueId",
    "name"
  ) // Populates venueId with the venue document, but only includes the 'name' field

  // 5. Return the successful response
  return res
    .status(200)
    .json(new ApiResponse(200, courts, "Courts retrieved successfully."))
})
export const getCourtsByVenue = asyncHandler(async (req, res) => {
  const { venueId } = req.params;

  const courts = await Court.find({ venueId })
    .select("name sportsType operatingHours"); // select only needed fields

  res.status(200).json(new ApiResponse(200, courts, "Courts fetched successfully"));
});
export { createCourt, getAllCourts, getCourtById, updateCourt, deleteCourt ,getAllCourtsByOwner}