import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/profile", protect, updateUserProfile);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
router.post("/verify-email", verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.post("/reset-password", resetPassword);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Private
 */
router.post("/resend-verification", protect, resendVerificationEmail);

/**
 * @route   POST /api/auth/test-email
 * @desc    Test email configuration (development only)
 * @access  Public
 */
if (process.env.NODE_ENV === "development") {
  router.post("/test-email", async (req, res) => {
    try {
      const { sendVerificationEmail } = await import(
        "../utils/emailService.js"
      );
      const { email = "test@example.com", name = "Test User" } = req.body;

      // Generate test token
      const testToken = "test_token_123456789";

      await sendVerificationEmail(email, testToken, name);

      res.json({
        success: true,
        message: `Test email sent to ${email}. Check your inbox!`,
      });
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({
        success: false,
        message: `Email test failed: ${error.message}`,
      });
    }
  });
}

export default router;
