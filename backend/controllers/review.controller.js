import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

// Helper function to update product review statistics
const updateProductReviewStats = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId, isActive: true });

    if (reviews.length === 0) {
      // No reviews, reset to defaults
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
      return;
    }

    // Calculate statistics
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / reviews.length).toFixed(1));

    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });

    // Update product
    await Product.findByIdAndUpdate(productId, {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    });
  } catch (error) {
    console.error("Error updating product review stats:", error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "newest", rating } = req.query;

    // Build query
    const query = { product: productId, isActive: true };
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "helpful":
        sortOptions = { "helpful.length": -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate("user", "name")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get user's review for a product
// @route   GET /api/reviews/product/:productId/user
// @access  Private
export const getUserProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({
      product: productId,
      user: userId,
      isActive: true,
    }).populate("user", "name");

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user._id;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      title,
      comment,
    });

    // Populate user info
    await review.populate("user", "name");

    // Update product review statistics
    await updateProductReviewStats(productId);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user._id;

    // Find review and ensure it belongs to the user
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
      isActive: true,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Update fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = rating;
    }
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;

    const updatedReview = await review.save();
    await updatedReview.populate("user", "name");

    // Update product review statistics
    await updateProductReviewStats(review.product);

    res.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    // Find review and ensure it belongs to the user
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
      isActive: true,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Soft delete
    review.isActive = false;
    await review.save();

    // Update product review statistics
    await updateProductReviewStats(review.product);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Toggle helpful status for a review
// @route   PATCH /api/reviews/:reviewId/helpful
// @access  Private
export const toggleHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({
      _id: reviewId,
      isActive: true,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Toggle helpful status
    await review.toggleHelpful(userId);
    await review.populate("user", "name");

    res.json({
      success: true,
      message: "Helpful status updated",
      data: review,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get review statistics for a product
// @route   GET /api/reviews/product/:productId/stats
// @access  Public
export const getProductReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
        ratingDistribution: product.ratingDistribution,
      },
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
