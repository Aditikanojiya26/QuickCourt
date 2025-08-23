
// controllers/review.controller.js
import { Review } from "../models/review.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const userId = req.user._id;

  // 1. Validate booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // 2. Check if booking belongs to user
  if (booking.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to review this booking");
  }

  // 3. Only allow review if booking is completed
  if (booking.status !== "completed") {
    throw new ApiError(400, "You can only review after booking is completed");
  }

  // 4. Create review
  const review = await Review.create({
    venueId: booking.venueId,
    bookingId,
    userId,
    rating,
    comment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

/**
 * @desc Update a review
 * @route PUT /api/reviews/:id
 * @access Private (user)
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.userId.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to update this review");
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  await review.save(); // middleware will auto-update booking & venue

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

/**
 * @desc Get all reviews for a venue
 * @route GET /api/reviews/venue/:venueId
 * @access Public
 */
export const getVenueReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ venueId: req.params.venueId })
    .populate("userId", "name")
    .populate("bookingId", "date startTime endTime");

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});
