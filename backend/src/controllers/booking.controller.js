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

  const venue = await Venue.findById(venueId);
  if (!venue) throw new ApiError(404, "Venue not found");

  const court = await Court.findById(courtId);
  if (!court) throw new ApiError(404, "Court not found");

  // Get pricePerHour from court operatingHours or fallback
  // Example: assuming pricePerHour is inside court.operatingHours.weekdays[0].pricePerHour
  let pricePerHour = 0;
  const day = new Date(date).getDay(); // 0=Sunday, 1=Monday, ...
  const isWeekend = (day === 0 || day === 6);

  if (isWeekend && court.operatingHours?.weekends?.length > 0) {
    pricePerHour = court.operatingHours.weekends[0].pricePerHour;
  } else if (court.operatingHours?.weekdays?.length > 0) {
    pricePerHour = court.operatingHours.weekdays[0].pricePerHour;
  }

  if (!pricePerHour) {
    // fallback to venue price or 0 if unavailable
    pricePerHour = venue.pricePerHour || 0;
  }

  const endTime = startTime + duration;

  const booking = await Booking.create({
    userId,
    courtId,
    venueId,
    date,
    startTime,
    endTime,
    totalPrice: pricePerHour * duration,
    status: "pending",
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

export const analysis=asyncHandler(async (req, res) => {
    const userId = req.user._id;
  // Step 1: Find venues owned by user
const venues = await Venue.find({ ownerId: userId });
const venueIds = venues.map(v => v._id);

if (venueIds.length === 0) {
  return res.json({ totalBookings: 0, activeCourts: 0, earnings: 0 });
}

// Step 2: Find courts belonging to those venues
const courts = await Court.find({ venueId: { $in: venueIds } });
const courtIds = courts.map(c => c._id);

if (courtIds.length === 0) {
  return res.json({ totalBookings: 0, activeCourts: 0, earnings: 0 });
}

// Step 3: Count bookings for those courts
const totalBookings = await Booking.countDocuments({
  courtId: { $in: courtIds },
  status: { $in: ["pending", "confirmed"] },
});

// Step 4: Active courts count
const activeCourts = courts.length;

// Step 5: Calculate earnings
const earningsAgg = await Booking.aggregate([
  { $match: { courtId: { $in: courtIds }, status: "confirmed" } },
  { $group: { _id: null, totalEarnings: { $sum: "$totalPrice" } } },
]);
const earnings = earningsAgg.length > 0 ? earningsAgg[0].totalEarnings : 0;

// Return
res.json({ totalBookings, activeCourts, earnings });
})

export const getOwnerBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find venues owned by this user
  const venues = await Venue.find({ ownerId: userId });
  const venueIds = venues.map(v => v._id);

  // Find courts in those venues
  const courts = await Court.find({ venueId: { $in: venueIds } });
  const courtIds = courts.map(c => c._id);

  // Find bookings for those courts
  const bookings = await Booking.find({ courtId: { $in: courtIds } })
    .populate("venueId", "name location")  // include venue name and location
    .populate("courtId", "name sportsType") // include court name and sport
    .populate("userId", "fullName email")   // optionally include user info
    .sort({ date: -1, startTime: 1 });

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: bookings,
  });
});