import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllStores, addUser, addStore 
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/stores", getAllStores);
router.post("/add-user", verifyToken, addUser);
router.post("/add-store", verifyToken, addStore);

export default router;
