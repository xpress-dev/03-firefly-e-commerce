import express from "express";
import {
  getProductReviews,
  getUserProductReview,
  createReview,
  updateReview,
  deleteReview,
  toggleHelpful,
  getProductReviewStats,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/reviews/product/:productId
 * @desc    Get all reviews for a product
 * @access  Public
 */
router.get("/product/:productId", getProductReviews);

/**
 * @route   GET /api/reviews/product/:productId/stats
 * @desc    Get review statistics for a product
 * @access  Public
 */
router.get("/product/:productId/stats", getProductReviewStats);

/**
 * @route   GET /api/reviews/product/:productId/user
 * @desc    Get user's review for a product
 * @access  Private
 */
router.get("/product/:productId/user", protect, getUserProductReview);

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post("/", protect, createReview);

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review
 * @access  Private
 */
router.put("/:reviewId", protect, updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private
 */
router.delete("/:reviewId", protect, deleteReview);

/**
 * @route   PATCH /api/reviews/:reviewId/helpful
 * @desc    Toggle helpful status for a review
 * @access  Private
 */
router.patch("/:reviewId/helpful", protect, toggleHelpful);

export default router;
