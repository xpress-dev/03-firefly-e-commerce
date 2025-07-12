// Import Mongoose and the Product Model
import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Create a Product
export const createProduct = async (req, res) => {
  // Get the New Product Details from Response's Body
  const product = req.body;

  // Check if the name, price, images, gender, category, sizes, description fields are provided
  if (
    !product.name ||
    !product.price ||
    !product.images ||
    !product.gender ||
    !product.category ||
    !product.sizes ||
    !product.description
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
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a Prodcut
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid ID." });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
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
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid ID." });
  }
  try {
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product removed successfully." });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
