import Address from "../models/address.model.js";

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
      isActive: true,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get a single address by ID
// @route   GET /api/addresses/:id
// @access  Private
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create a new address
// @route   POST /api/addresses
// @access  Private
export const createAddress = async (req, res) => {
  try {
    const {
      type,
      label,
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // Validation
    if (
      !label ||
      !firstName ||
      !lastName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user already has 5 addresses
    const existingCount = await Address.countDocuments({
      user: req.user._id,
      isActive: true,
    });
    if (existingCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum of 5 addresses allowed per user",
      });
    }

    // Create address
    const address = await Address.create({
      user: req.user._id,
      type,
      label,
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || "United States",
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);

    // Handle duplicate default address error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Only one default address allowed per user",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const {
      type,
      label,
      firstName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // Find the address and ensure it belongs to the user
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update fields
    if (type !== undefined) address.type = type;
    if (label !== undefined) address.label = label;
    if (firstName !== undefined) address.firstName = firstName;
    if (lastName !== undefined) address.lastName = lastName;
    if (phone !== undefined) address.phone = phone;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    const updatedAddress = await address.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);

    // Handle duplicate default address error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Only one default address allowed per user",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Soft delete by setting isActive to false
    address.isActive = false;
    await address.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Set address as default
// @route   PATCH /api/addresses/:id/set-default
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Set all other addresses to non-default
    await Address.updateMany(
      { user: req.user._id, _id: { $ne: req.params.id } },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json({
      success: true,
      message: "Default address updated successfully",
      data: address,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get default address for user
// @route   GET /api/addresses/default
// @access  Private
export const getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user: req.user._id,
      isDefault: true,
      isActive: true,
    });

    res.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
