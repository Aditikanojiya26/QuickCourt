// routes/review.routes.js
import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  createReview,
  updateReview,
  getVenueReviews
} from "../controllers/review.controller.js";

const router = Router();

// Create a review (only for completed bookings)
router.post("/", verifyJWT, authorizeRoles("user"), createReview);

// Update my review
router.put("/:id", verifyJWT, authorizeRoles("user"), updateReview);

// Get all reviews for a specific venue
router.get("/venue/:venueId", getVenueReviews);

export default router;
