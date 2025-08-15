import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { approveVenue, getApprovedVenues, getPendingVenues, getRejectedVenues, getUsers, rejectVenue } from "../controllers/admin.controller.js";
import { Booking } from "../models/booking.models.js";
const router = Router()
router.get(
  "/pending",
  verifyJWT,
  authorizeRoles("admin"),
  getPendingVenues
);
router.get("/venues/approved", getApprovedVenues);
router.get("/venues/rejected", getRejectedVenues);
router.patch("/venues/:id/approve", verifyJWT, authorizeRoles("admin"), approveVenue);
router.patch("/venues/:id/reject", verifyJWT, authorizeRoles("admin"), rejectVenue);
router.route("/getUsers").get(verifyJWT,authorizeRoles("admin", "superadmin"), getUsers);
// routes/seedBookings.js




export default router;