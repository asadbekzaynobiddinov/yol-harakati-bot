import bot from "./src/bot/index.js";
import { connectDb } from "./src/db/index.js";

const bootstrap = async () => {
  await connectDb();
  bot.start();
};

bootstrap();
