import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUsers } from "../controllers/admin.controller.js";
const router = Router()
router.route("/getUsers").get(verifyJWT,authorizeRoles("admin", "superadmin"), getUsers);
export default router;