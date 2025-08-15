import { Router } from "express"

// import middleware for authentication if needed
// import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

// Assuming you have middleware to protect this route
router.route("/").post(/* verifyJWT, */ createCourt)

import {
  createCourt,
  getAllCourts,
  getAllCourtsByOwner,
  getCourtsByVenue,
} from "../controllers/court.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js"
router.get("/", getAllCourts)
// Assuming you have middleware to protect this route
router.route("/").post(verifyJWT, createCourt)
router.get(
  "/getAllCourtsByOwner",
  verifyJWT,
  authorizeRoles("facilityowner"),
  getAllCourtsByOwner
)
router.get("/venue/:venueId", getCourtsByVenue);

export default router