import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { forgotPassword, loginUser, logoutUser, me, refreshAccessToken, registerUser, resetPassword, verifyRegistrationOtp} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);
router.post("/verify-registration", verifyRegistrationOtp);
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/me").get(verifyJWT,me)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router