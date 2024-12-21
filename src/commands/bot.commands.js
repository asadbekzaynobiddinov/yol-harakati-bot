import { InlineKeyboard } from "grammy";
import { sendQuestion } from "../handlers/questions.handler.js";
import { mainMenuKeys } from "../keyboards/index.js";
import { Question, User } from "../schema/index.js";

export const startCommand = async (ctx) => {
  try {
    const channelUsername = '@fulstack_dev';
    const { id, username, first_name, last_name } = ctx.from;

    const keyboard = new InlineKeyboard().url('Kanalga qo\'shilish', `https://t.me/+rdEyAn6RqTNlY2Fi`);

    const user = username || first_name || last_name || 'Foydalanuvchi';
    console.log(`Foydalanuvchi ma'lumotlari: ID: ${id}, Username: ${user}`);

    const chatMember = await ctx.api.getChatMember(channelUsername, id);
    console.log(chatMember.status)
    if (chatMember.status == 'left') {
      await ctx.reply(`Botdan to'liq foydalanish uchun avval quyidagi kanalga a'zo bo'ling`, { reply_markup: keyboard });
      return;
    }

    const currentUser = await User.find({ id });
    if (currentUser.length === 0) {
      const newUser = new User({
        id,
        first_name: first_name || `Ismi noma'lum`,
        last_name: last_name || `Familyasi noma'lum`,
        username: username || `Username yo'q`,
      });
      await newUser.save();
    }

    await ctx.reply(`
      "Assalomu alaykum!👋"\n\n` +
       `"Haydovchilik guvohnomasini olishga yordam beruvchi botga xush kelibsiz! 🚗\n\n` +
       `Bu yerda siz yo'l harakati qoidalari va imtihon savollari bo'yicha mashq qilishingiz mumkin.\n\n` +
       `Mashqlarni bajaring, bilimlaringizni mustahkamlang va haydovchilik guvohnomasini olishga tayyorlaning! 🚦\n` +
       `Xavfsiz haydovchi bo'ling! 😊"`)
     await mainMenuKeys(ctx)

  } catch (error) {
    console.error(error.message);
  }
};


export const questions20 = async (ctx) => {
  try {
    const numbers = [];
    while (numbers.length < 20) {
      const rand = Math.floor(Math.random() * 700) + 1;
      if (!numbers.includes(rand)) {
        numbers.push(rand);
      }
    }
    const questions = []
    for (let i of numbers) {
      const question = await Question.findOne({ id: i })
      questions.push(question)
    }
    ctx.session.questions = questions
    await sendQuestion(ctx, ctx.session.questions[ctx.session.currentQuestionId])
  } catch (error) {
    console.log(error.message)
  }
}

export const questions10 = async (ctx) => {
  try {
    const numbers = [];
    while (numbers.length < 10) {
      const rand = Math.floor(Math.random() * 700) + 1;
      if (!numbers.includes(rand)) {
        numbers.push(rand);
      }
    }
    const questions = []
    for (let i of numbers) {
      const question = await Question.findOne({ id: i })
      questions.push(question)
    }
    ctx.session.questions = questions
    await sendQuestion(ctx, ctx.session.questions[ctx.session.currentQuestionId])
  } catch (error) {
    conmsole.log(error.message)
  }
}

export const ratingCommand = async (ctx) => {
  await ctx.reply('Reyting')
}
