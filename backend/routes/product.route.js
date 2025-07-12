// Import Express
import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

// Define Router
const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (should be Private/Admin in production)
 * @body    {
 *            name: String (required),
 *            price: Number (required),
 *            description: String (required),
 *            images: Array (required),
 *            gender: String (required),
 *            category: String (required),
 *            sizes: Array (required)
 *          }
 * @returns {Object} { success: Boolean, data: Product }
 */
router.post("/", createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 * @query   None (currently no pagination or filtering)
 * @returns {Object} { success: Boolean, data: Array<Product> }
 */
router.get("/", getProducts);

/**
 * @route   PATCH /api/products/:id
 * @desc    Update a product by ID (partial update)
 * @access  Public (should be Private/Admin in production)
 * @params  id - Product ID (MongoDB ObjectId)
 * @body    {
 *            name?: String,
 *            price?: Number,
 *            description?: String,
 *            images?: Array,
 *            gender?: String,
 *            category?: String,
 *            sizes?: Array
 *          }
 * @returns {Object} { success: Boolean, data: Product }
 */
router.patch("/:id", updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Public (should be Private/Admin in production)
 * @params  id - Product ID (MongoDB ObjectId)
 * @returns {Object} { success: Boolean, message: String }
 */
router.delete("/:id", deleteProduct);

// Export Router
export default router;
