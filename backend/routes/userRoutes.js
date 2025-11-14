import express from "express";
import { updatePassword, listUsers, listStores } from "../controllers/userController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Update password (user & owner)
router.put("/password", verifyToken, authorizeRole(["user", "owner"]), updatePassword);

// Admin APIs
router.get("/", verifyToken, authorizeRole(["admin"]), listUsers);
router.get("/stores", verifyToken, authorizeRole(["admin"]), listStores);

export default router;
