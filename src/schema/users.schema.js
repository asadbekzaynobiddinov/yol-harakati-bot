import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  username: String,
  lang: String,
  currentTicketId: Number,
  quizStatus: String,
  currentQuestionId: { type: Number, default: 0 },
});

export const User = mongoose.model("user", usersSchema);
