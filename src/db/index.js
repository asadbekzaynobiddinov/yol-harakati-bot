import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDb successfuly connected');
  } catch (error) {
    console.log(error.message);
  }
};
