import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.sample" });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(`\n MongoDB connected !! HOST: ${connectionInstance.connection.host}`); // do not directly write host it it connectionInstance.connection.host not connectionInstance.host
  } catch (error) {
    console.log("MongoDB connection error: " + error);
    process.exit(1);
  }
};
export default connectDB;