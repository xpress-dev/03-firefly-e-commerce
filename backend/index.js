// Imports
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// DotENV Config Initilization
dotenv.config();

// App Initilization
const app = express();

// Express JSON Middleware
app.use(express.json());

// Define PORT
const PORT = process.env.PORT;

// Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on http://localhost:${PORT}`);
});
