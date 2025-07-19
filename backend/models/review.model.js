import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    helpful: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Pre-save middleware to validate rating
reviewSchema.pre("save", function (next) {
  if (this.rating < 1 || this.rating > 5) {
    return next(new Error("Rating must be between 1 and 5"));
  }
  next();
});

// Method to calculate helpful count
reviewSchema.methods.getHelpfulCount = function () {
  return this.helpful.length;
};

// Method to check if user has marked as helpful
reviewSchema.methods.isHelpfulByUser = function (userId) {
  return this.helpful.some((h) => h.user.toString() === userId.toString());
};

// Method to toggle helpful status
reviewSchema.methods.toggleHelpful = function (userId) {
  const existingIndex = this.helpful.findIndex(
    (h) => h.user.toString() === userId.toString()
  );

  if (existingIndex > -1) {
    // Remove helpful mark
    this.helpful.splice(existingIndex, 1);
  } else {
    // Add helpful mark
    this.helpful.push({ user: userId });
  }

  return this.save();
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
