// Imports
import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateProductInventory,
  deleteProduct,
  getLowStockProducts,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

// Initialize Router
const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get("/", getProducts);

// @route   GET /api/products/low-stock
// @desc    Get low stock products (admin only)
// @access  Private/Admin
router.get("/low-stock", protect, admin, getLowStockProducts);

// @route   GET /api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get("/slug/:slug", getProductBySlug);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post("/", protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put("/:id", protect, admin, updateProduct);

// @route   PUT /api/products/:id/inventory
// @desc    Update product inventory
// @access  Private/Admin
router.put("/:id/inventory", protect, admin, updateProductInventory);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProduct);

// Export Router
export default router;
