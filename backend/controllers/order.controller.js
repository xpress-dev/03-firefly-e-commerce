// Imports
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

    // Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    // Validate products and check inventory
    const validatedOrderItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (!product.isInStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for product: ${product.name}`,
        });
      }

      validatedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
        size: item.size,
      });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      notes,
    });

    // Calculate prices (done automatically by pre-save hook)
    const createdOrder = await order.save();

    // Reduce inventory for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.reduceInventory(item.quantity);
      await product.save();
    }

    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid order ID",
      });
    }

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentResult } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = paymentResult;

    if (order.status === "Pending") {
      order.status = "Processing";
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Only allow cancellation if order is not shipped or delivered
    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that has been shipped or delivered",
      });
    }

    order.status = "Cancelled";

    // Restore inventory
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inventory += item.quantity;
        await product.save();
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
