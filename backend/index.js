// Imports
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";

// DotENV Config Initilization
dotenv.config();

// App Initilization
const app = express();

// Express JSON Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Define PORT
const PORT = process.env.PORT;

// Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on http://localhost:${PORT}`);
});
