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
} from "../commands/index.js";
import { User } from "../schema/users.schema.js";

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

bot.api.setMyCommands([
  { command: "start", description: "Botni ishga tushirish" },
  { command: "stop", description: "Savollarni tugatish" },
]);

bot.command("start", (ctx) => {
  startCommand(ctx);
});

bot.command("stop", async (ctx) => {
  await User.updateOne(
    { id: ctx.from.id },
    {
      currentQuestionId: 0,
      currentTicketId: 0,
      inQuiz: false,
      quizStatus: "",
    }
  );
  startCommand(ctx);
});

bot.on("callback_query:data", async (ctx) => {
  const [command] = ctx.callbackQuery.data.split("=");
  const user = await User.findOne({ id: ctx.from.id });

  const message = {
    uz: `Siz hali a'zo bo'lmadingiz`,
    kr: `Сиз ҳали аъзо бўлмагансиз`,
    ru: `Вы еще не подписались`,
  };

  switch (command) {
    case "uz":
      setLanguage(ctx, "uz");
      break;
    case "kr":
      setLanguage(ctx, "kr");
      break;
    case "ru":
      setLanguage(ctx, "ru");
      break;
    case "tickets":
      ticketsCommand(ctx);
      break;
    case "random":
      randomTest(ctx);
      break;
    case "changeLang":
      changeLanguage(ctx);
      break;
    case "questions10":
      test10(ctx);
      break;
    case "questions20":
      test20(ctx);
      break;
    case "prev":
      prevCommand(ctx);
      break;
    case "next":
      nextCommand(ctx);
      break;
    case "back":
      backCommand(ctx);
      break;
    case "ticket":
      ticketsButton(ctx);
      break;
    case "check":
      const member = await ctx.api.getChatMember("@fulstack_dev", ctx.from.id);
      if (member.status == "left") {
        ctx.api.answerCallbackQuery(ctx.callbackQuery.id, {
          text: message[user.lang],
          show_alert: true,
        });
      } else {
        startCommand(ctx);
      }
      break;
    default:
      break;
  }
});

bot.on("poll_answer", (ctx) => {
  pollCommand(ctx);
});

export default bot;
