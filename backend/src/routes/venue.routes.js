import { Router } from "express";
import {
  createVenue,
  getAllVenues,
  getVenueById,
  updateVenue,
  deleteVenue
} from "../controllers/venue.controller.js";

import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

// Accept multiple images for venue photos
router.post(
  "/",
  verifyJWT,
  authorizeRoles("facilityowner"),
  upload.array("photos", 10), // up to 10 images
  createVenue
);
router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.put("/:id", verifyJWT, authorizeRoles("facilityowner"), updateVenue);
router.delete("/:id", verifyJWT, authorizeRoles("facilityowner"), deleteVenue);

export default router;
