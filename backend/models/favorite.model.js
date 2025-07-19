import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one favorite per user per product
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

// Pre-save middleware to validate data
favoriteSchema.pre("save", function (next) {
  if (!this.user || !this.product) {
    return next(new Error("User and product are required"));
  }
  next();
});

// Method to check if product is favorited by user
favoriteSchema.statics.isFavorited = async function (userId, productId) {
  const favorite = await this.findOne({ user: userId, product: productId });
  return !!favorite;
};

// Method to get user's favorite count
favoriteSchema.statics.getUserFavoriteCount = async function (userId) {
  return await this.countDocuments({ user: userId });
};

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
