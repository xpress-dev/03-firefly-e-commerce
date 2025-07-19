// Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import adminRoutes from "./routes/admin.route.js";

// DotENV Config Initilization
dotenv.config();

// App Initilization
const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173", // Vite default port
      "http://localhost:5174", // Alternative Vite port
      process.env.CLIENT_URL,
    ];

    // In production, only allow specific domains
    if (process.env.NODE_ENV === "production") {
      // Add your production domains here
      allowedOrigins.push("https://your-production-domain.com");
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["X-Total-Count"], // Allow frontend to read pagination headers
};

// Enable CORS
app.use(cors(corsOptions));

// Express JSON Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Define PORT
const PORT = process.env.PORT;

// Start Server
app.listen(PORT, async () => {
  // Connect to database
  connectDB();

  // Test email configuration in development
  if (process.env.NODE_ENV === "development") {
    try {
      const { testEmailConfiguration } = await import(
        "./utils/emailService.js"
      );
      const emailTest = await testEmailConfiguration();
      if (emailTest.success) {
        console.log("📧 Email service ready");
      } else {
        console.log("⚠️  Email service warning:", emailTest.message);
      }
    } catch (error) {
      console.log("⚠️  Email service not configured:", error.message);
    }
  }

  console.log(`Server is listening on http://localhost:${PORT}`);
});
