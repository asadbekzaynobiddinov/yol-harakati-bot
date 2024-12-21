import { Bot, session } from "grammy";
import { config } from "dotenv";

import { questions20, startCommand, questions10 } from "./commands/bot.commands.js";
import { mainMenuKeys, ticketsKey } from "./keyboards/index.js";
import { callbackQuery } from "./commands/inline.commannnds.js";
import { sendQuestion, sendRandomQuestion } from "./handlers/questions.handler.js";
import { Question } from "./schema/test.schema.js";

config();

const token = process.env.TOKEN

const bot = new Bot(token)

bot.use(
  session({
    initial: () => ({
      page: 1,
      limit: 10,
      currentQuestionId: 0,
      startTime: null,
      lastMessageId: null,
      inRandom: false
    }),
  })
);

bot.api.setMyCommands([
  { command: 'start', description: 'Botni boshlash' },
  { command: 'stop', description: 'Savollarni tugatish' },
  { command: 'biletlar', description: 'Biletlar ro\'yxatini ko\'rsatish' },
  { command: '10talik_test', description: '10 ta savol bilan test boshlash' },
  { command: '20talik_test', description: '20 ta savol bilan test boshlash' }
]);


bot.command('start', async (ctx) => {
  await startCommand(ctx)
})

bot.command('stop', async (ctx) => {
  try {
    if (ctx.session.inRandom) {
      ctx.session.inRandom = false
      ctx.session.questions = null
      ctx.session.currentQuestionId = 0
      await sendRandomQuestion(ctx, null)
      return null
    }
    if (!ctx.session.questions) {
      return await ctx.reply(`Sizda hozirda faol testlar yoq`)
    }
    ctx.session.questions = null
    ctx.session.currentQuestionId = 0
    await sendQuestion(ctx, null)
  } catch (error) {
    console.log(error.message)
  }
})

bot.on('callback_query:data', async (ctx) => {
  await callbackQuery(ctx)
})

bot.hears('Biletlar 🎟', async (ctx) => {
  ticketsKey(ctx)
})

bot.hears("Imtihon 20 👨🏼‍💻", async (ctx) => {
  try {
    if (ctx.session.questions) {
      return await ctx.reply("Sizda tugallanmagan test mavjud !\nTugatish uchun /stop buyrug'ini bering !")
    }
    await ctx.reply('Savollar yuklanmoqda... ⏳')
    await ctx.reply(`Testni to'xtatish uchun /stop buyrug'ini bering !`)
    await questions20(ctx)
  } catch (error) {
    console.log(error.message)
  }
})

bot.hears("Imtihon 10 👨🏼‍💻", async (ctx) => {
  try {
    if (ctx.session.questions) {
      return await ctx.reply("Sizda tugallanmagan test mavjud !\nTugatish uchun /stop buyrug'ini bering !")
    }
    await ctx.reply('Savollar yuklanmoqda... ⏳')
    await ctx.reply(`Testni to'xtatish uchun /stop buyrug'ini bering !`)
    await questions10(ctx)
  } catch (error) {
    console.log(error.message)
  }
})

bot.hears('Random Savollar 🎲', async (ctx) => {
  try {
    ctx.session.inRandom = true
    const randomNumber = Math.floor(Math.random() * 700) + 1;
    const question = await Question.findOne({ id: randomNumber })
    await sendRandomQuestion(ctx, question)
  } catch (error) {

  }
})

export default bot