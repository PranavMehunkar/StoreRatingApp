import express from "express";
import { getOwnerDashboard,  changeOwnerPassword} from "../controllers/owner.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getOwnerDashboard);
router.post("/change-password", authMiddleware, changeOwnerPassword);

export default router;
