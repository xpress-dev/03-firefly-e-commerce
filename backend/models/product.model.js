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
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
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
    },
    inventory: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug from name
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function (quantity = 1) {
  return this.inventory >= quantity;
};

// Method to reduce inventory
productSchema.methods.reduceInventory = function (quantity) {
  if (this.inventory >= quantity) {
    this.inventory -= quantity;
    return true;
  }
  return false;
};

// Model the Schema
const Product = mongoose.model("Product", productSchema);

// Export the Model
export default Product;
