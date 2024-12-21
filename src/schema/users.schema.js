import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  id: {type: Number},
  first_name: { type: String},
  last_name: { type: String},
  username: { type: String},
})

export const User = mongoose.model('user', usersSchema)