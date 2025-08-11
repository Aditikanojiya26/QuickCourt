// routes/venue.routes.js
import { Router } from "express";
import { createVenue, getAllVenues, getVenueById, updateVenue, deleteVenue } from "../controllers/venue.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", verifyJWT, authorizeRoles("facilityOwner"), createVenue);
router.get("/", getAllVenues);
router.get("/:id", getVenueById);
router.put("/:id", verifyJWT, authorizeRoles("facilityOwner"), updateVenue);
router.delete("/:id", verifyJWT, authorizeRoles("facilityOwner"), deleteVenue);

export default router;
