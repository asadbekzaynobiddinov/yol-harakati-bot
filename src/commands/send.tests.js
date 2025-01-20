import mongoose from "mongoose";
import { User } from "../schema/users.schema.js";

export const sendQuestion = async (ctx, question) => {

  const user = await User.findOne({ id: ctx.update.poll_answer.user.id })
  
  if (user.currentQuestionId == 10) {
    await User.updateOne({ id: ctx.update.poll_answer.user.id }, { currentQuestionId: 0 })
    return ctx.api.sendMessage( ctx.update.poll_answer.user.id, 'Barhca savollar tugadi');
  }

  const questionLang = {
    uz: 'Savol',
    kr: 'Савол',
    ru: 'Вопрос'
  }
  
  const questionText = `[${user.currentQuestionId + 1} / 10] - ${questionLang[user.lang]}\n` +  question.question;
  const answers = question.choices.map((choice) => choice.text);
  const correctAnswerId = question.choices.findIndex((choice) => choice.answer === true);

  const lt300 = questionText.length <= 300;
  const lt100 = answers.every((answer) => answer.length <= 100);

  if (lt300 && lt100) {

    if(question.media.exist){
      await ctx.api.sendPhoto(ctx.update.poll_answer.user.id, process.env.IMAGE_URL + `${question.media.name}.png`)
    }

    await ctx.api.sendPoll(
      ctx.update.poll_answer.user.id,
      questionText,
      answers,
      {
        type: 'quiz',
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    )
    await User.updateOne({ id: ctx.update.poll_answer.user.id }, { currentQuestionId: user.currentQuestionId + 1 })
    return;
  }

  const message = `${questionText}\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n\n")}`;
  const fixedAnswers = answers.map((answer, index) => `${index + 1}.`)
  
  const choiseMessage = {
    uz: 'Birini tanlang: ',
    kr: 'Бирини танланг: ',
    ru: 'Выберите один: ',
  }

  if(question.media.exist){
    await ctx.api.sendPhoto(ctx.update.poll_answer.user.id, process.env.IMAGE_URL + `${question.media.name}.png`, {
      caption: message
    })

    await ctx.api.sendPoll(
      ctx.update.poll_answer.user.id,
      choiseMessage[user.lang],
      fixedAnswers,
      {
        type: 'quiz',
        correct_option_id: correctAnswerId,
        is_anonymous: false,
        open_period: 60,
      }
    )
    await User.updateOne({ id: ctx.update.poll_answer.user.id }, { currentQuestionId: user.currentQuestionId + 1 })
    return;
  }

  await ctx.api.sendMessage(user.id, message)

  await ctx.api.sendPoll(
    ctx.update.poll_answer.user.id,
    choiseMessage[user.lang],
    fixedAnswers,
    {
      type: 'quiz',
      correct_option_id: correctAnswerId,
      is_anonymous: false,
      open_period: 60,
    }
  )
  await User.updateOne({ id: ctx.update.poll_answer.user.id }, { currentQuestionId: user.currentQuestionId + 1 })
  return;
}

