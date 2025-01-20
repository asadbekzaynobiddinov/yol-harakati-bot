import { Bot, session } from "grammy";
import { config } from "dotenv";
import {
  startCommand,
  setLanguage,
  changeLanguage,
  backCommand,
  nextCommand,
  prevCommand,
  ticketsButton,
  ticketsCommand,
  randomTest,
  test10,
  test20,
  pollCommand,
} from '../commands/index.js';

config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(
  session({
    initial: () => ({
      page: 1,
      lastMessage: null,
      currentQuestionId: 0,
    }),
  })
);

bot.command("start", (ctx) => {
  startCommand(ctx);
});

bot.on("callback_query:data", (ctx) => {
  const [command] = ctx.callbackQuery.data.split("=");
  switch (command) {
    case 'uz':
      setLanguage(ctx, 'uz');   
      break;
    case 'kr':
      setLanguage(ctx, 'kr');
      break;
    case 'ru':
      setLanguage(ctx, 'ru');
      break;
    case 'tickets':
      ticketsCommand(ctx);
      break;
    case 'random':
      randomTest(ctx);
      break;
    case 'changeLang':
      changeLanguage(ctx);
      break;
    case 'questions10':
      test10(ctx);
      break
    case 'questions20':
      test20(ctx);
      break;
    case 'prev':
      prevCommand(ctx);
      break;
    case 'next':
      nextCommand(ctx);
      break;
    case 'back':
      backCommand(ctx);
      break;
    case 'ticket':
      ticketsButton(ctx);
      break;
    default:
      break;
  }
});

bot.on("poll_answer", (ctx) => {
  pollCommand(ctx)
});

bot.on("poll", async (ctx) => {
  const poll = ctx.poll;
  if (poll.is_closed) {
      const correctOption = poll.correct_option_id;
      await ctx.api.sendMessage(poll.chat_id, `Quiz tugadi! To'g'ri javob: ${poll.options[correctOption].text}`);
  }
});

export default bot;
