import { Bot, session } from "grammy";
import { config } from "dotenv";

import { questions20, startCommand } from "./commands/bot.commands.js";
import { ticketsKey } from "./keyboards/index.js";
import { callbackQuery } from "./commands/inline.commannnds.js";

config();

const token = process.env.TOKEN

const bot = new Bot(token)

bot.use(
  session({
    initial: () => ({
      page: 1,
      limit: 10,
      currentQuestionId: 0
    }),
  })
);

bot.command('start', async (ctx) => {
  await startCommand(ctx)
})

bot.on('callback_query:data', async (ctx) => {
  await callbackQuery(ctx)
})

bot.hears('Biletlar 🎟', async (ctx) => {
  ticketsKey(ctx)
})

bot.hears("Imtihon 20 👨🏼‍💻", async (ctx) => {
  await questions20(ctx)
})


export default bot