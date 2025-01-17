import { Bot, session } from "grammy";
import { config } from "dotenv";
import { startCommand } from "../commands/index.js";
import { setLanguage, changeLanguage} from "../commands/language.commands.js";
import { backCommand, nextCommand, prevCommand, ticketsCommand } from "../commands/tickets.command.js";
import { randomTest, test10, test20 } from "../commands/questions.commands.js";

config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(
  session({
    initial: () => ({
      page: 1,
      startTime: null,
      lastMessage: null
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
    default:
      break;
  }
});

export default bot;
