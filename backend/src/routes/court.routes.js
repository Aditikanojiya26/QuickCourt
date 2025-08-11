import { Router } from "express"
import { createCourt } from "../controllers/court.controller.js"
// import middleware for authentication if needed
// import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

// Assuming you have middleware to protect this route
router.route("/").post(/* verifyJWT, */ createCourt)

export default router