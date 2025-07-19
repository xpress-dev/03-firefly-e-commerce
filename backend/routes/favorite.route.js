import express from "express";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  checkIfFavorited,
  getFavoriteCount,
  toggleFavorite,
} from "../controllers/favorite.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/favorites
 * @desc    Get user's favorites
 * @access  Private
 */
router.get("/", protect, getUserFavorites);

/**
 * @route   POST /api/favorites
 * @desc    Add product to favorites
 * @access  Private
 */
router.post("/", protect, addToFavorites);

/**
 * @route   DELETE /api/favorites/:productId
 * @desc    Remove product from favorites
 * @access  Private
 */
router.delete("/:productId", protect, removeFromFavorites);

/**
 * @route   GET /api/favorites/check/:productId
 * @desc    Check if product is favorited
 * @access  Private
 */
router.get("/check/:productId", protect, checkIfFavorited);

/**
 * @route   GET /api/favorites/count
 * @desc    Get user's favorite count
 * @access  Private
 */
router.get("/count", protect, getFavoriteCount);

/**
 * @route   PATCH /api/favorites/toggle/:productId
 * @desc    Toggle favorite status
 * @access  Private
 */
router.patch("/toggle/:productId", protect, toggleFavorite);

export default router;
