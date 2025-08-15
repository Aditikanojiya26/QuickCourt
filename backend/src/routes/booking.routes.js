// routes/booking.routes.js
import { Router } from "express";

import {
  createBooking,
  updateBookingStatus,
  getMyBookings,
  getVenueBookings,
  getCourtsByVenue,
  getAvailableSlots,
  analysis,
  getOwnerBookings,
  getBookingTrends,
  getEarningsSummary,
  getPeakHours,
 
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = Router();

// Create a booking (user)
router.post("/", verifyJWT, authorizeRoles("user"), createBooking);

// Update booking status (owner/admin)
router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("facilityowner", "admin"),
  updateBookingStatus
);
router.post("/bookslot",verifyJWT,createBooking)
router.get("/:venueId/courts", getCourtsByVenue);
router.get("/slots", getAvailableSlots);
// Get my bookings
router.get("/mybooking", verifyJWT, authorizeRoles("user"), getMyBookings);

// Get all bookings for a venue (owner/admin)
router.get(
  "/venue/:venueId",
  verifyJWT,
  authorizeRoles("facilityowner", "admin"),
  getVenueBookings
);
router.get(
  "/summary",verifyJWT,analysis
);
router.get(
  "/getOwnerBooking",verifyJWT,getOwnerBookings
);
router.get("/trends", getBookingTrends); // e.g. ?period=daily
router.get("/earnings", getEarningsSummary);
// router.get("/peak-hours", getPeakHours);



export default router;
