import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const MongoDBUrl = process.env.MONGO_URL;
    await mongoose.connect(MongoDBUrl);
    console.log("Connected to MongoDB Database");
  } catch (error) {
    console.error("Error connecting to MongoDB Database: " + error);
  }
};

export default dbConnection;
