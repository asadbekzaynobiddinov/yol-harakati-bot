import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

export const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL)
    console.log('mongodb connected')
  } catch (error) {
    console.log(error.message)
  }
}
