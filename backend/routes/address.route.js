import express from "express";
import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} from "../controllers/address.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

/**
 * @route   GET /api/addresses
 * @desc    Get all addresses for the authenticated user
 * @access  Private
 */
router.get("/", getUserAddresses);

/**
 * @route   GET /api/addresses/default
 * @desc    Get the default address for the authenticated user
 * @access  Private
 */
router.get("/default", getDefaultAddress);

/**
 * @route   GET /api/addresses/:id
 * @desc    Get a specific address by ID
 * @access  Private
 */
router.get("/:id", getAddressById);

/**
 * @route   POST /api/addresses
 * @desc    Create a new address
 * @access  Private
 */
router.post("/", createAddress);

/**
 * @route   PUT /api/addresses/:id
 * @desc    Update an existing address
 * @access  Private
 */
router.put("/:id", updateAddress);

/**
 * @route   DELETE /api/addresses/:id
 * @desc    Delete an address (soft delete)
 * @access  Private
 */
router.delete("/:id", deleteAddress);

/**
 * @route   PATCH /api/addresses/:id/set-default
 * @desc    Set an address as the default address
 * @access  Private
 */
router.patch("/:id/set-default", setDefaultAddress);

export default router;
