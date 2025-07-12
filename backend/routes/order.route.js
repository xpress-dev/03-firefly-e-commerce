// Imports
import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  cancelOrder,
} from "../controllers/order.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

// Initialize Router
const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", protect, createOrder);

// @route   GET /api/orders
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get("/", protect, admin, getOrders);

// @route   GET /api/orders/myorders
// @desc    Get user orders
// @access  Private
router.get("/myorders", protect, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get("/:id", protect, getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put("/:id/status", protect, admin, updateOrderStatus);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put("/:id/pay", protect, updateOrderToPaid);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put("/:id/cancel", protect, cancelOrder);

// Export Router
export default router;
