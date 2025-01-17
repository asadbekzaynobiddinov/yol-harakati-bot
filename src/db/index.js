import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB successfully connected");
  } catch (error) {
    console.log(error.message);
  }
};
