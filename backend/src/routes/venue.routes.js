// routes/venue.routes.js
import { Router } from "express";
import { createVenue, getAllVenues, getVenueById, updateVenue, deleteVenue } from "../controllers/venue.controller.js";

import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, authorizeRoles("facilityowner"), createVenue);
router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.put("/:id", verifyJWT, authorizeRoles("facilityowner"), updateVenue);
router.delete("/:id", verifyJWT, authorizeRoles("facilityowner"), deleteVenue);

export default router;
