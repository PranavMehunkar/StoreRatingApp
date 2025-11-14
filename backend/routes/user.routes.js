import express from "express";
import { getAllStores, submitRating, changePassword } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/stores", authMiddleware, getAllStores);
router.post("/rating", authMiddleware, submitRating);
router.put("/change-password", authMiddleware, changePassword);

export default router;
