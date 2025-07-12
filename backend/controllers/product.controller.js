// Import Mongoose and the Product Model
import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Create a Product
export const createProduct = async (req, res) => {
  // Get the New Product Details from Response's Body
  const product = req.body;

  // Check if the name, price, images, gender, category, sizes, description, inventory fields are provided
  if (
    !product.name ||
    !product.price ||
    !product.images ||
    !product.gender ||
    !product.category ||
    !product.sizes ||
    !product.description ||
    product.inventory === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }
  try {
    // Add the New Product to the Database
    const newProduct = await Product.create(product);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      gender,
      minPrice,
      maxPrice,
      search,
      inStock,
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (inStock === "true") filter.inventory = { $gt: 0 };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Single Product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid ID.",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Product by Slug
export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid ID.",
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Product Inventory
export const updateProductInventory = async (req, res) => {
  const { id } = req.params;
  const { inventory } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid ID.",
    });
  }

  if (inventory === undefined || inventory < 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid inventory amount.",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.inventory = inventory;
    const updatedProduct = await product.save();

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid ID.",
    });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product removed successfully.",
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Low Stock Products (Admin only)
export const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;

    const lowStockProducts = await Product.find({
      inventory: { $lte: Number(threshold) },
    }).sort({ inventory: 1 });

    res.status(200).json({
      success: true,
      data: lowStockProducts,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
