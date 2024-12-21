import { sendQuestion } from "../handlers/questions.handler.js";
import { mainMenuKeys } from "../keyboards/index.js";
import { Question, User } from "../schema/index.js";

export const startCommand = async (ctx) => {
  await ctx.reply(`
    "Assalomu alaykum!👋"\n\n` +
    `"Haydovchilik guvohnomasini olishga yordam beruvchi botga xush kelibsiz! 🚗\n\n` +
    `Bu yerda siz yo'l harakati qoidalari va imtihon savollari bo'yicha mashq qilishingiz mumkin.\n\n` +
    `Mashqlarni bajaring, bilimlaringizni mustahkamlang va haydovchilik guvohnomasini olishga tayyorlaning! 🚦\n` +
    `Xavfsiz haydovchi bo'ling! 😊"`)
  const { id, first_name, last_name, username } = ctx.from
  await mainMenuKeys(ctx)
  const currentUser = await User.find({ id })
  if (currentUser.length == 0) {
    const newUser = new User({ id, first_name, last_name, username })
    await newUser.save()
  }
}

export const questions20 = async (ctx) => {
  const numbers = [];
  while (numbers.length < 20) {
    const rand = Math.floor(Math.random() * 700) + 1;
    if (!numbers.includes(rand)) {
      numbers.push(rand);
    }
  }
  const questions = []
  for(let i of numbers){
    const question = await Question.findOne({id: i})
    questions.push(question)
  }
  ctx.session.questions = questions
  await sendQuestion(ctx, ctx.session.questions[ctx.session.currentQuestionId])
}

export const ratingCommand = async (ctx) => {
  await ctx.reply('Reyting')
}
