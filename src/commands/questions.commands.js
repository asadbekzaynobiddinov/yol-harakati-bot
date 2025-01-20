import mongoose from "mongoose";
import { User } from "../schema/users.schema.js";
import { sendRandomQuestion } from "./send.tests.js";

export const test10 = async (ctx) => {
  if (
    ctx.session.lastMessage &&
    ctx.session.lastMessage.message_id !=
      ctx.update.callback_query.message.message_id
  ) {
    await ctx.api.deleteMessage(
      ctx.from.id,
      ctx.update.callback_query.message.message_id
    );
    return;
  }
};

export const test20 = async (ctx) => {
  if (
    ctx.session.lastMessage &&
    ctx.session.lastMessage.message_id !=
      ctx.update.callback_query.message.message_id
  ) {
    await ctx.api.deleteMessage(
      ctx.from.id,
      ctx.update.callback_query.message.message_id
    );
    return;
  }
};

export const randomTest = async (ctx) => {
  if (
    ctx.session.lastMessage &&
    ctx.session.lastMessage.message_id !=
      ctx.update.callback_query.message.message_id
  ) {
    await ctx.api.deleteMessage(
      ctx.from.id,
      ctx.update.callback_query.message.message_id
    );
    return;
  }

  const user = await User.findOne({id: ctx.from.id})
  await User.updateOne({ id: ctx.from.id }, { quizStatus: 'random' })

  const questionLang = {
    uz: 'Savol',
    kr: 'Савол',
    ru: 'Вопрос'
  }

  const startQuizMessage = {
    uz: 'Test boshlandi.',
    kr: 'Тест бошланди.',
    ru: 'Вопросы начались.',
  }

  await ctx.api.editMessageText(ctx.from.id, ctx.update.callback_query.message.message_id, startQuizMessage[user.lang])
  const randomSkip = Math.floor(Math.random() * 700);
  const [question] = await mongoose.connection.db.collection(`savollar_${user.lang}`).find().skip(randomSkip).limit(1).toArray();
  const questionText = `[${question.id}] - ${questionLang[user.lang]}\n` + question.question;
  const answers = question.choices.map((choice) => choice.text);
  const correctAnswerId = question.choices.findIndex((choice) => choice.answer === true);

  const lt300 = questionText.length <= 300;
  const lt100 = answers.every((answer) => answer.length <= 100);

  if (lt300 && lt100) {

    if (question.media.exist) {
      await ctx.api.sendPhoto(ctx.from.id, process.env.IMAGE_URL + `${question.media.name}.png`)
    }

    await ctx.api.sendPoll(
      ctx.from.id,
      questionText,
      answers,
      {
        type: 'quiz',
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    )
    return;
  }

  const message = `${questionText}\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n\n")}`;
  const fixedAnswers = answers.map((answer, index) => `${index + 1}.`)

  const choiseMessage = {
    uz: 'Birini tanlang: ',
    kr: 'Бирини танланг: ',
    ru: 'Выберите один: ',
  }

  if (question.media.exist) {
    await ctx.api.sendPhoto(ctx.from.id, process.env.IMAGE_URL + `${question.media.name}.png`, {
      caption: message
    })

    await ctx.api.sendPoll(
      ctx.from.id,
      choiseMessage[user.lang],
      fixedAnswers,
      {
        type: 'quiz',
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    )
    return;
  }

  await ctx.api.sendMessage(ctx.from.id, message)

  await ctx.api.sendPoll(
    ctx.from.id,
    choiseMessage[user.lang],
    fixedAnswers,
    {
      type: 'quiz',
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    }
  )
  return;
};