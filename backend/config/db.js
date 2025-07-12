// Import Mongoose
import mongoose from "mongoose";

// Define connectDB Async Function
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connection Established: ${conn.connection.host}`);
  } catch (error) {
    console.error(`There was an error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
