import { Booking } from "../models/booking.models.js";
import { Court } from "../models/court.model.js";
import { Venue } from "../models/venue.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTotalBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all venues owned by user (only their IDs)
  const venueIds = await Venue.find({ ownerId: userId }).distinct("_id");

  // Total bookings & courts
  const totalBooking = await Booking.countDocuments({ venueId: { $in: venueIds } });
  const totalCourts = await Court.countDocuments({ venueId: { $in: venueIds } });

  // Date range: today → next 6 days
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOf7thDay = new Date();
  endOf7thDay.setDate(endOf7thDay.getDate() + 6);
  endOf7thDay.setHours(23, 59, 59, 999);

  // Trends by date (7-day chart)
  const trends = await Booking.aggregate([
    {
      $match: {
        venueId: { $in: venueIds },
        date: {
          $gte: startOfToday,
          $lte: endOf7thDay
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        bookings: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);


  const bookingsByStartTime = await Booking.aggregate([
    {
      $match: {
        venueId: { $in: venueIds }
      }
    },
    {
      $group: {
        _id: "$startTime",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const chartData = getNext7DaysTrends(trends);
const totalEarningsResult = await Booking.aggregate([
  {
    $match: {
        venueId: { $in: venueIds }
      }
  },
  {
    $group: {
      _id: null,
      totalEarnings: { $sum: "$totalPrice" }
    }
  }
]);

const totalEarnings =
  totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalBooking, totalCourts, chartData, bookingsByStartTime,totalEarningsResult },
      "Booking fetched successfully"
    )
  );
});

function getNext7DaysTrends(trends) {
    const today = new Date();
    const result = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);

        const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
        const found = trends.find(t => t._id === key);

        result.push({
            label: d.toLocaleDateString("en-US", { weekday: "short" }), // Sat, Sun...
            bookings: found ? found.bookings : 0
        });
    }

    return result;
}