import { InlineKeyboard } from "grammy";
import { User } from "../schema/users.schema.js";

export const startCommand = async (ctx) => {
  const currentUser = await User.findOne({ id: ctx.from.id });

  if (!currentUser) {
    const message =
      `Assalomu alaykum, ${ctx.from.first_name}!\n` +
      `O'zingizga kerakli bo'lgan tilni tanlang:\n\n` +
      `Ассалому алайкум, ${ctx.from.first_name}!\n` +
      `Ўзингизга керакли бўлган тилни танланг:\n\n` +
      `Здравствуйте, ${ctx.from.first_name}!\n` +
      `Выберите нужный вам язык:`;
    ctx.session.lastMessage = await ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: `🇺🇿 O'zbekcha`, callback_data: "uz" }],
          [{ text: "🇺🇿 Узбекча", callback_data: "kr" }],
          [{ text: "🇷🇺 Русский", callback_data: "ru" }],
        ],
      },
    });
    return;
  }

  const message = {
    uz: `Kerakli bo'limni tanlang:`,
    kr: `Керакли бўлимни танланг:`,
    ru: `Выберите нужный вам раздел:`,
  };

  const buttons = {
    uz: new InlineKeyboard()
      .text("🎫 Test Biletlari ", "tickets")
      .text("🔀 Tasodifiy Testlar", "random")
      .row()
      .text("❓ Test Savollari 10", "questions10")
      .text("❓ Test Savollari 20", "questions20")
      .row()
      .text("🌐 Tilni o'zgartirish", "changeLang"),
    kr: new InlineKeyboard()
      .text("🎫 Тест Билетлари", "tickets")
      .text("🔀 Тасодифий Тестлар", "random")
      .row()
      .text("❓ Тест Саволлари 10", "questions10")
      .text("❓ Тест Саволлари 20", "questions20")
      .row()
      .text("🌐 Тилни ўзгартириш", "changeLang"),
    ru: new InlineKeyboard()
      .text("🎫 тестовые билеты", "tickets")
      .text("🔀 Cлучайные тесты", "random")
      .row()
      .text("❓ 10 вопросов", "questions10")
      .text("❓ 20 вопросов", "questions20")
      .row()
      .text("🌐 Изменить язык", "changeLang"),
  };

  if (ctx.update.callback_query) {
    await ctx.api.editMessageText(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id,
      message[currentUser.lang],
      {
        reply_markup: buttons[currentUser.lang],
      }
    );
    return;
  }

  ctx.session.lastMessage = await ctx.reply(message[currentUser.lang], {
    reply_markup: buttons[currentUser.lang],
  });
};
