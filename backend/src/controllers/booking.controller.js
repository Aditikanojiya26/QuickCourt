
import { Court } from "../models/court.model.js";
import { Venue } from "../models/venue.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/booking.models.js";
import { getAvailableSlotsForCourtOnDate } from "../utils/booking.utils.js";
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { courtId, date } = req.query;

  if (!courtId || !date) {
    return res.status(400).json(new ApiResponse(400, null, "courtId and date are required"));
  }

  const slots = await getAvailableSlotsForCourtOnDate(courtId, date);
  res.status(200).json(new ApiResponse(200, slots, "Slots fetched successfully"));
});


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
function parseTimeToNumber(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h + (m / 60);
}




export const createBooking = asyncHandler(async (req, res) => {
  const { venueId, courtId, sport, date, slot } = req.body;

  if (!venueId || !courtId || !sport || !date || !slot) {
    return res.status(400).json({ status: false, message: 'Missing required fields' });
  }

  const court = await Court.findById(courtId).lean();
  if (!court) return res.status(404).json({ status: false, message: 'Court not found' });
  if (String(court.venueId) !== String(venueId)) {
    return res.status(400).json({ status: false, message: 'Court does not belong to venue' });
  }
  if (court.sportsType?.toLowerCase() !== sport?.toLowerCase()) {
    return res.status(400).json({ status: false, message: 'Selected sport does not match court sport' });
  }

  // Validate slot availability
  const available = await getAvailableSlotsForCourtOnDate(courtId, date);
  const slotObj = available.find((s) => s.slot === slot && !s.isBooked);
  if (!slotObj) {
    return res.status(409).json({ status: false, message: 'Slot not available' });
  }

  // Parse slot into startTime and endTime
  const [startStr, endStr] = slot.split('-');
const startTime = parseTimeToNumber(startStr);
const endTime = parseTimeToNumber(endStr);


  const totalPrice = slotObj.pricePerHour; // or multiply by duration if not 1 hour

  const booking = await Booking.create({
    venueId,
    courtId,
    userId: req.user._id, // attach logged-in user
    sport,
    date,
    slot,
    startTime,
    endTime,
    totalPrice,
    status: 'pending',
  });

  res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
});


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


// Helper: get dates between two dates (inclusive)
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// 1. Booking summary (total bookings, active courts, earnings)


// 2. Booking trends - last 7 days daily count
export async function getBookingTrends(req, res) {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const trends = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: today },
          status: "booked",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing dates with 0 bookings
    const datesInRange = getDatesInRange(startDate, today);
    const result = datesInRange.map((date) => {
      const dateStr = date.toISOString().slice(0, 10);
      const found = trends.find((t) => t._id === dateStr);
      return {
        label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        bookings: found ? found.bookings : 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 3. Earnings summary breakdown (group by category - example categories: Courts, Matches, Rentals, Others)
// Here, we'll assume you have booking types or categories stored; if not, just send fixed data or extend your schema.
// For now, aggregate by venueId as a sample
export async function getEarningsSummary(req, res) {
  try {
    // Sample: group earnings by venueId and populate venue name (if you want)
    // For simplicity, we'll group by venueId and return totalPrice sum

    const earnings = await Booking.aggregate([
      { $match: { status: "booked" } },
      {
        $group: {
          _id: "$venueId",
          totalEarnings: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 }, // top 5 venues by earnings
    ]);

    // Optionally populate venue names here if you want

    // Format data to send name and value for pie chart
    // For now just use venueId string as name placeholder
    const response = earnings.map((item, idx) => ({
      name: `Venue ${item._id.toString().slice(-4)}`, // mock name
      value: item.totalEarnings,
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 4. Peak booking hours (group by startTime hour)
export async function getPeakHours(req, res) {
  try {
    // Consider bookings for last 30 days
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);

    const peakHours = await Booking.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: today },
          status: "booked",
        },
      },
      {
        $group: {
          _id: "$startTime",
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing hours 6 to 20 (your booking hours range)
    const fullHours = [];
    for (let hour = 6; hour <= 20; hour++) {
      const found = peakHours.find((h) => h._id === hour);
      fullHours.push({
        hour: `${hour}:00`,
        bookings: found ? found.bookings : 0,
      });
    }

    res.json(fullHours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
