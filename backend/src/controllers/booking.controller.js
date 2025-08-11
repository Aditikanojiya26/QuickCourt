// controllers/booking.controller.js
import { Booking } from "../models/booking.model.js";
import { Venue } from "../models/venue.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * @desc Create a booking
 * @route POST /api/bookings
 * @access Private (user)
 */
import { Venue } from "../models/venue.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { venueId, courtId, date, startTime, duration } = req.body;
  const userId = req.user._id;

  // 1. Validate venue
  const venue = await Venue.findById(venueId);
  if (!venue) throw new ApiError(404, "Venue not found");

  const openTime = venue.openTime; // e.g., 8 for 8:00 AM
  const closeTime = venue.closeTime; // e.g., 20 for 8:00 PM

  if (startTime < openTime || startTime >= closeTime) {
    throw new ApiError(400, `Start time must be between ${openTime}:00 and ${closeTime - 1}:00`);
  }

  // 2. Get all bookings for that court & date
  const bookings = await Booking.find({
    venueId,
    courtId,
    date,
    status: { $in: ["pending", "confirmed"] }
  }).sort({ startTime: 1 });

  // 3. Build slot map for the day
  const slots = [];
  for (let t = openTime; t < closeTime; t++) {
    const isBooked = bookings.some(
      b => b.startTime <= t && b.endTime > t
    );
    slots.push({
      time: `${t}-${t + 1}`,
      status: isBooked ? "booked" : "available"
    });
  }

  // 4. Calculate maximum possible duration from selected start time
  const startSlotIndex = startTime - openTime;
  let maxDuration = 0;
  for (let i = startSlotIndex; i < slots.length; i++) {
    if (slots[i].status === "booked") break;
    maxDuration++;
  }

  // 5. Check if requested duration fits
  if (duration > maxDuration) {
    throw new ApiError(
      400,
      `Only ${maxDuration} hour(s) available starting at ${startTime}:00`
    );
  }

  // 6. Calculate end time
  const endTime = startTime + duration;
  if (endTime > closeTime) {
    throw new ApiError(400, `Booking must end before ${closeTime}:00`);
  }

  // 7. Create booking
  const booking = await Booking.create({
    userId,
    courtId,
    venueId,
    date,
    startTime,
    endTime,
    totalPrice: venue.pricePerHour * duration, // optional if you have pricing
    status: "pending"
  });

  res.status(201).json(
    new ApiResponse(201, booking, "Booking created successfully")
  );
});



/**
 * @desc Update booking status (confirm/cancel/complete)
 * @route PATCH /api/bookings/:id
 * @access Private (admin or owner)
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");

  booking.status = status;
  await booking.save();

  res.json(new ApiResponse(200, booking, "Booking status updated"));
});

/**
 * @desc Get bookings for current user
 * @route GET /api/bookings/my
 * @access Private (user)
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate("venueId", "name location")
    .sort({ date: -1 });

  res.json(new ApiResponse(200, bookings, "User bookings fetched"));
});

/**
 * @desc Get all bookings for a venue (owner/admin)
 * @route GET /api/bookings/venue/:venueId
 * @access Private (owner/admin)
 */
export const getVenueBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ venueId: req.params.venueId })
    .populate("userId", "name email")
    .sort({ date: -1 });

  res.json(new ApiResponse(200, bookings, "Venue bookings fetched"));
});
