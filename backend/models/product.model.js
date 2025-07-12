// Import
import mongoose from "mongoose";

// Define Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "Product must have at least one image",
      },
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Shirt", "T-Shirt", "Trouser", "Shoes", "Jacket", "Suit"],
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "Product must have at least one size",
      },
      description: {
        type: String,
        maxlength: 500,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Model the Schema
const Product = mongoose.model("Product", productSchema);

// Export the Model
export default Product;
