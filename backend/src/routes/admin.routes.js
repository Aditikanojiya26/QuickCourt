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


router.post("/seed-bookings", async (req, res) => {
  try {
    const sampleBookings = [];

    // Sample IDs for userId, courtId, venueId - replace these with real ones from your DB
    const userIds = [
      "689a1b90cb661591ceac5caf",
      "689a1b90cb661591ceac5cb0",
      "689a1b90cb661591ceac5cb1",
    ];
    const courtIds = [
      "689a5a693d1bbcfda832128f",
      "689a5a693d1bbcfda8321290",
      "689a5a693d1bbcfda8321291",
    ];
    const venueIds = [
      "6899f47aefde25eb42d9926c",
      "6899f47aefde25eb42d9926d",
      "6899f47aefde25eb42d9926e",
    ];

    for (let i = 0; i < 50; i++) {
      const randomUserId = userIds[i % userIds.length];
      const randomCourtId = courtIds[i % courtIds.length];
      const randomVenueId = venueIds[i % venueIds.length];

      // Spread dates across next 30 days from today
      const date = new Date();
      date.setDate(date.getDate() + (i % 30));

      // Random start time between 6AM (6) and 8PM (20)
      const startTime = 6 + (i % 14);
      const endTime = startTime + 1; // 1-hour booking

      const totalPrice = 100 + (i % 5) * 10; // just a sample variation

      sampleBookings.push({
        userId: randomUserId,
        courtId: randomCourtId,
        venueId: randomVenueId,
        date,
        startTime,
        endTime,
        totalPrice,
        status: "booked",
        rating: 0,
      });
    }

    // Insert many at once
    const inserted = await Booking.insertMany(sampleBookings);

    res.status(201).json({ message: "50 bookings inserted", count: inserted.length });
  } catch (error) {
    console.error("Error seeding bookings:", error);
    res.status(500).json({ error: "Failed to seed bookings" });
  }
});



export default router;