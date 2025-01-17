import { InlineKeyboard } from "grammy";
import { User } from "../schema/users.schema.js";
import { getModel } from "../schema/test.schema.js";

export const ticketsCommand = async (ctx) => {
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
  const message = {
    uz: `Bilet raqamlaridan tanlasangiz bo'ladi:`,
    kr: `Билет номерларидан танласангиз бўлади:`,
    ru: `Выберите номер билета:`,
  }

  const buttons = new InlineKeyboard();

  const page = ctx.session.page;
  const start = (page - 1) * 10 + 1;
  const end = page * 10;

  for (let i = start; i <= end; i++) {
    buttons.text(`${i}`, `ticket=${i}`);
    if ((i - start + 1) % 5 === 0) {
      buttons.row();
    }
  }

  const buttonText = {
    uz: "🔙 Orqaga",
    kr: "🔙 Орқага",
    ru: "🔙 Назад",
  }

  buttons
    .row()
    .text("⬅️", "prev")
    .text("➡️", "next")
    .row()
    .text(`${buttonText[currentUser.lang]}`, "back");

  ctx.session.lastMessage = await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    message[currentUser.lang], {
    reply_markup: buttons,
  })
}

export const prevCommand = async (ctx) => {
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

  const message = {
    uz: `Siz ro'yxatning boshidasiz.`,
    kr: `Сиз рўйхатнинг бошидасиз.`,
    ru: `Вы находитесь в начале списка.`, 
  }

  if (ctx.session.page == 1) {
    return ctx.answerCallbackQuery({
      text: message[currentUser.lang],
      show_alert: true,
    })
  }
  ctx.session.page = Math.max(1, (ctx.session.page || 1) - 1);
  ticketsCommand(ctx)
};

export const nextCommand = async (ctx) => {

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

  const message = {
    uz: `Siz ro'yxatning oxiridasiz`,
    kr: `Сиз рўйхатнинг охиридасиз`,
    ru: `Вы находитесь в конце списка`,
  }
  
  if (ctx.session.page == 7) {
    return ctx.answerCallbackQuery({
      text: message[currentUser.lang],
      show_alert: true,
    })
  }
  ctx.session.page = Math.max(1, (ctx.session.page || 1) + 1);
  await ticketsCommand(ctx)
}

export const backCommand = async (ctx) => {

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

  ctx.session.lastMessage = await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    message[currentUser.lang], {
    reply_markup: buttons[currentUser.lang],
  })
  return;
}