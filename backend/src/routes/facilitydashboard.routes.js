import { Router } from "express"
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getTotalBookings } from "../controllers/facilitydashboard.controller.js"
const router= Router()
router.get("/getTotalBookings",verifyJWT,authorizeRoles("facilityowner"),getTotalBookings)
export default router;
