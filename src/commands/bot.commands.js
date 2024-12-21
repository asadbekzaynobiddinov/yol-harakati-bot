import { Question, Image } from "../schema/index.js";
import { mainMenuKeys } from "../keyboards/index.js";
import { User } from "../schema/index.js";

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

export const testCommand = async (ctx) => {
  await ctx.reply('Test')
}

export const ratingCommand = async (ctx) => {
  await ctx.reply('Reyting')
}
