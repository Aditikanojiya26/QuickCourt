// routes/booking.routes.js
import { Router } from "express";

import {
  createBooking,
  updateBookingStatus,
  getMyBookings,
  getVenueBookings
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

// Get my bookings
router.get("/my", verifyJWT, authorizeRoles("user"), getMyBookings);

// Get all bookings for a venue (owner/admin)
router.get(
  "/venue/:venueId",
  verifyJWT,
  authorizeRoles("facilityowner", "admin"),
  getVenueBookings
);

export default router;
