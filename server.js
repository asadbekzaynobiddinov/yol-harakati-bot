import { connectDb } from "./src/db/index.js"
import bot from "./src/bot.js"

const bootsrap = async () => {
  await connectDb()
  bot.start()
}

bootsrap()
