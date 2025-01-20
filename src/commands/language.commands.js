import { InlineKeyboard } from "grammy";
import { User } from "../schema/users.schema.js";
import { checkUser } from "./check.js";
import { startCommand } from "./start.command.js";

export const changeLanguage = async (ctx) => {
  const currentUser = await User.findOne({ id: ctx.from.id });

  if (
    ctx.session.lastMessage &&
    ctx.session.lastMessage.message_id !=
      ctx.update.callback_query.message.message_id
  ) {
    await ctx.api.deleteMessage(
      ctx.from.id,
      ctx.update.callback_query.message.message_id
    );
    return;
  }

  const userMessage = {
    uz: `Botdan to'liq foydalanish uchun avval kanalga a'zo bo'ling!`,
    kr: `Ботдан тўлиқ фойдаланиш учун аввал каналга аъзо бўлинг!`,
    ru: `Чтобы использовать бота полностью, сначала подпишитесь на канал!`,
  };

  const userButtons = {
    uz: new InlineKeyboard()
      .url(`Kanalga o'tish ➡️`, "t.me/+rdEyAn6RqTNlY2Fi")
      .row()
      .text(`Obuna bo'ldim ✅`, "check"),
    kr: new InlineKeyboard()
      .url(`Каналга ўтиш ➡️`, "t.me/+rdEyAn6RqTNlY2Fi")
      .row()
      .text(`Обуна бўлдим ✅`, "check"),
    ru: new InlineKeyboard()
      .url(`Перейти в канал ➡️`, "t.me/+rdEyAn6RqTNlY2Fi")
      .row()
      .text(`Подписался ✅`, "check"),
  };

  const userStatus = await checkUser(ctx);

  if (!userStatus) {
    ctx.session.lastMessage = await ctx.reply(userMessage[currentUser.lang], {
      reply_markup: userButtons[currentUser.lang],
    });
    return;
  }

  const message = {
    uz: "Kerakli tilni tanlang: 🇺🇿",
    kr: "Керакли тилни танланг: 🇺🇿",
    ru: "Выберите нужный язык: 🇷🇺",
  };

  ctx.session.lastMessage = await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    message[currentUser.lang],
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇺🇿 O'zbekcha", callback_data: "uz" }],
          [{ text: "🇺🇿 Узбекча", callback_data: "kr" }],
          [{ text: "🇷🇺 Русский", callback_data: "ru" }],
        ],
      },
    }
  );
  return;
};

export const setLanguage = async (ctx, lang) => {
  if (
    ctx.session.lastMessage &&
    ctx.session.lastMessage.message_id !=
      ctx.update.callback_query.message.message_id
  ) {
    await ctx.api.deleteMessage(
      ctx.from.id,
      ctx.update.callback_query.message.message_id
    );
    return;
  }

  const currentUser = await User.findOne({ id: ctx.from.id });
  if (!currentUser) {
    await User.create({
      id: ctx.from.id,
      first_name: ctx.from.first_name || "unknown",
      last_name: ctx.from.last_name || "unknown",
      username: ctx.from.username || "unknown",
      lang,
    });
    startCommand(ctx);
    return;
  }

  currentUser.lang = lang;
  await currentUser.save();
  startCommand(ctx);
};
