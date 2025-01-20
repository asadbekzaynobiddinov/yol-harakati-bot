import mongoose from "mongoose";
import { User } from "../schema/users.schema.js";
import { sendQuestion } from "./send.tests.js";

export const pollCommand = async (ctx) => {
  const user = await User.findOne({ id: ctx.update.poll_answer.user.id })
  const skip = (user.currentTicketId - 1) * 10 + user.currentQuestionId
  const test = await mongoose.connection.db.collection(`savollar_${user.lang}`).find().skip(skip).limit(1).toArray();
  sendQuestion(ctx, test[0]);
};