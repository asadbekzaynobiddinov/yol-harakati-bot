import mongoose from "mongoose";
import { User } from "../schema/users.schema.js";
import {
  sendTicktetsQuestion,
  sendRandomQuestion,
  sndLimitedQuestions,
} from "./send.tests.js";

export const pollCommand = async (ctx) => {
  const user = await User.findOne({ id: ctx.update.poll_answer.user.id });

  switch (user.quizStatus) {
    case "ticket":
      const skip = (user.currentTicketId - 1) * 10 + user.currentQuestionId;
      const test = await mongoose.connection.db
        .collection(`savollar_${user.lang}`)
        .find()
        .skip(skip)
        .limit(1)
        .toArray();
      sendTicktetsQuestion(ctx, test[0]);
      break;
    case "10test":
      const skip10 = Math.floor(Math.random() * 700);
      const [question10] = await mongoose.connection.db
        .collection(`savollar_${user.lang}`)
        .find()
        .skip(skip10)
        .limit(1)
        .toArray();
      sndLimitedQuestions(ctx, question10, 10);
      break;
    case "20test":
      const skip20 = Math.floor(Math.random() * 700);
      const [question20] = await mongoose.connection.db
        .collection(`savollar_${user.lang}`)
        .find()
        .skip(skip20)
        .limit(1)
        .toArray();
      sndLimitedQuestions(ctx, question20, 20);
      break;
    case "random":
      const randomSkip = Math.floor(Math.random() * 700);
      const randomTest = await mongoose.connection.db
        .collection(`savollar_${user.lang}`)
        .find()
        .skip(randomSkip)
        .limit(1)
        .toArray();
      sendRandomQuestion(ctx, randomTest[0]);
      break;
    default:
      break;
  }
};
