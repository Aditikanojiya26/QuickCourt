// controllers/booking.controller.js
import { Booking } from "../models/booking.models.js";
import { Court } from "../models/court.model.js";
import { Venue } from "../models/venue.model.js";
import dayjs from "dayjs"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCourtsByVenue = asyncHandler(async (req, res) => {
  const { venueId } = req.params;
  
  // Validate venue exists
  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  // Fetch courts for this venue
  const courts = await Court.find({ venueId });

  res.status(200).json(new ApiResponse(200, courts, "Courts fetched successfully"));
});

// GET /bookings/slots?venueId=...&courtId=...&date=...


export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { venueId, courtId, date } = req.query;

  if (!venueId || !courtId || !date) {
    throw new ApiError(400, "Missing required query parameters");
  }

  const venue = await Venue.findById(venueId);
  if (!venue) throw new ApiError(404, "Venue not found");

  const court = await Court.findById(courtId);
  if (!court) throw new ApiError(404, "Court not found");

  const dayOfWeek = dayjs(date).day(); // 0=Sun, 6=Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Select operating hours array based on day type
  let operatingSlots = [];
  if (isWeekend) {
    operatingSlots = court.operatingHours.weekends || [];
  } else {
    operatingSlots = court.operatingHours.weekdays || [];
  }

  if (operatingSlots.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No operating hours for this day"));
  }

  // Fetch existing bookings
  const bookings = await Booking.find({
    venueId,
    courtId,
    date,
    status: { $in: ["pending", "confirmed"] },
  }).sort({ startTime: 1 });

  const slots = [];

  // Generate slots for **each operating slot**
  for (const slot of operatingSlots) {
    for (let t = slot.start; t < slot.end; t++) {
      const isBooked = bookings.some(
        (b) => b.startTime <= t && b.endTime > t
      );
      slots.push({
        time: `${t}-${t + 1}`,
        status: isBooked ? "booked" : "available",
        pricePerHour: slot.pricePerHour,
      });
    }
  }

  res.status(200).json(new ApiResponse(200, slots, "Slots fetched successfully"));
});


export const createBooking = asyncHandler(async (req, res) => {
  const { venueId, courtId, date, startTime, duration } = req.body;
  const userId = req.user._id;

  // 1. Validate venue
  const venue = await Venue.findById(venueId);
  if (!venue) throw new ApiError(404, "Venue not found");

  const openTime = venue.openTime; 
  const closeTime = venue.closeTime; 

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
