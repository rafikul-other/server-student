import mongoose from "mongoose";
import config from "./index.js";

const dbConnection = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Connected to MongoDB Database");
  } catch (error) {
    console.error("Error connecting to MongoDB Database: " + error);
    process.exit(1);
  }
};

export default dbConnection;