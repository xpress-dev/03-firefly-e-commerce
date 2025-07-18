import express from "express";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(protect);
router.use(admin);

// Admin stats route
router.get("/stats", getAdminStats);

// User management routes
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
