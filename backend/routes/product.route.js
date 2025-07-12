// Import Express
import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

// Define Router
const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
router.post("/", protect, admin, createProduct);

/**
 * @route   PATCH /api/products/:id
 * @desc    Update a product by ID
 * @access  Private/Admin
 */
router.patch("/:id", protect, admin, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteProduct);

// Export Router
export default router;
