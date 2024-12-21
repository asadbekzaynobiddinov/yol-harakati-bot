import { Bot, session } from "grammy";
import { config } from "dotenv";

import { questions20, startCommand, questions10 } from "./commands/bot.commands.js";
import { mainMenuKeys, ticketsKey } from "./keyboards/index.js";
import { callbackQuery } from "./commands/inline.commannnds.js";
import { sendQuestion } from "./handlers/questions.handler.js";

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
      lastMessageId: null
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
    ctx.session.questions = null
    ctx.session.currentQuestionId = 0
    ctx.session.correctAnswers = 0
    ctx.session.incorrectAnswers = 0
    await ctx.api.deleteMessage(ctx.from.id, ctx.message.message_id - 1)
    return mainMenuKeys(ctx)
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


export default bot