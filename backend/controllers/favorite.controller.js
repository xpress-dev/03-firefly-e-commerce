import Favorite from "../models/favorite.model.js";
import Product from "../models/product.model.js";

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getUserFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const userId = req.user._id;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get favorites with populated product data
    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: "product",
        select:
          "name price images category gender inventory averageRating totalReviews",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Favorite.countDocuments({ user: userId });

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: favorites,
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

// @desc    Add product to favorites
// @route   POST /api/favorites
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
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

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your favorites",
      });
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: userId,
      product: productId,
    });

    // Populate product data
    await favorite.populate({
      path: "product",
      select:
        "name price images category gender inventory averageRating totalReviews",
    });

    res.status(201).json({
      success: true,
      message: "Product added to favorites",
      data: favorite,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your favorites",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Remove product from favorites
// @route   DELETE /api/favorites/:productId
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Find and delete favorite
    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.json({
      success: true,
      message: "Product removed from favorites",
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Check if product is favorited
// @route   GET /api/favorites/check/:productId
// @access  Private
export const checkIfFavorited = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const isFavorited = await Favorite.isFavorited(userId, productId);

    res.json({
      success: true,
      data: { isFavorited },
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get user's favorite count
// @route   GET /api/favorites/count
// @access  Private
export const getFavoriteCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Favorite.getUserFavoriteCount(userId);

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/favorites/toggle/:productId
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: userId,
      product: productId,
    });

    let result;
    let message;

    if (existingFavorite) {
      // Remove from favorites
      await Favorite.findByIdAndDelete(existingFavorite._id);
      result = { isFavorited: false };
      message = "Product removed from favorites";
    } else {
      // Add to favorites
      const favorite = await Favorite.create({
        user: userId,
        product: productId,
      });
      await favorite.populate({
        path: "product",
        select:
          "name price images category gender inventory averageRating totalReviews",
      });
      result = { isFavorited: true, favorite };
      message = "Product added to favorites";
    }

    res.json({
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
