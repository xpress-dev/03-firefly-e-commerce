import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"],
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    addressLine2: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
      default: "United States",
    },
    isDefault: {
      type: Boolean,
      default: false,
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

// Compound index to ensure unique default address per user
addressSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);

// Pre-save middleware to handle default address logic
addressSchema.pre("save", async function (next) {
  // If this address is being set as default, unset other default addresses for this user
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id }, isActive: true },
      { isDefault: false }
    );
  }

  // Check if user already has 5 active addresses (excluding this one if it's an update)
  const existingCount = await this.constructor.countDocuments({
    user: this.user,
    _id: { $ne: this._id },
    isActive: true,
  });

  if (existingCount >= 5 && this.isNew) {
    throw new Error("Maximum of 5 addresses allowed per user");
  }

  next();
});

// Pre-remove middleware to handle default address logic
addressSchema.pre("remove", async function (next) {
  // If this was the default address, set another active address as default
  if (this.isDefault) {
    const anotherAddress = await this.constructor.findOne({
      user: this.user,
      _id: { $ne: this._id },
      isActive: true,
    });

    if (anotherAddress) {
      anotherAddress.isDefault = true;
      await anotherAddress.save();
    }
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
