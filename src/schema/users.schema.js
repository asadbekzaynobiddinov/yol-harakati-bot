import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  username: String,
  lang: String,
  currentTicketId: Number,
  quizStatus: String,
  inQuiz: { type: Boolean, default: false },
  currentQuestionId: { type: Number, default: 0 },
});

export const User = mongoose.model("user", usersSchema);
