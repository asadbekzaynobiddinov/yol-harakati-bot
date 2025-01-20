import { InlineKeyboard } from "grammy";
import { User } from "../schema/users.schema.js";
import mongoose from "mongoose";

export const ticketsCommand = async (ctx) => {
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
  await User.updateOne({ id: ctx.from.id }, { currentQuestionId: 0 })

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
  
  await User.updateOne({ id: ctx.from.id }, { page: ctx.session.page })

  ticketsCommand(ctx)
};

export const nextCommand = async (ctx) => {

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


export const ticketsButton = async (ctx) => {
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
  const [, ticket] = ctx.update.callback_query.data.split("=");

  const skip = (+ticket - 1) * 10;

  const [question] = await mongoose.connection.db.collection(`savollar_${currentUser.lang}`).find().skip(skip).limit(1).toArray();

  const questionLang = {
    uz: 'Savol',
    kr: 'Савол',
    ru: 'Вопрос'
  }

  const startQuizMessage = {
    uz: 'Test boshlandi.',
    kr: 'Тест бошланди.',
    ru: 'Вопросы начались.',
  }

  const questionText = `[${currentUser.currentQuestionId + 1} / 10] - ${questionLang[currentUser.lang]}\n` + question.question;
  const answers = question.choices.map((choice) => choice.text);
  const correctAnswerId = question.choices.findIndex((choice) => choice.answer === true);

  const lt300 = questionText.length <= 300;
  const lt100 = answers.every((answer) => answer.length <= 100);

  await ctx.api.editMessageText(ctx.from.id, ctx.update.callback_query.message.message_id, startQuizMessage[currentUser.lang])

  if (lt300 && lt100) {

    if(question.media.exist){
      await ctx.api.sendPhoto(ctx.from.id, process.env.IMAGE_URL + `${question.media.name}.png`)
    }
  
    await ctx.api.sendPoll(
      ctx.from.id,
      questionText,
      answers,
      {
        type: 'quiz',
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    )
    await User.updateOne({ id: ctx.from.id }, { currentQuestionId: currentUser.currentQuestionId + 1, currentTicketId: ticket })
    return;
  }

  const message = `${questionText}\n\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n\n")}`;
  
  const choiseMessage = {
    uz: 'Birini tanlang: ',
    kr: 'Бирини танланг: ',
    ru: 'Выберите один: ',
  }

  const fixedAnswers = answers.map((answer, index) => `${index + 1}.`)

  if(question.media.exist){
    await ctx.api.sendPhoto(ctx.from.id, process.env.IMAGE_URL + `${question.media.name}.png`, {
      caption: message
    })
    await ctx.api.sendPoll(
      ctx.from.id,
      choiseMessage[currentUser.lang],
      fixedAnswers,
      {
        type: 'quiz',
        correct_option_id: correctAnswerId,
        is_anonymous: false,
        open_period: 60,
      }
    )
    await User.updateOne({ id: ctx.from.id }, { currentQuestionId: currentUser.currentQuestionId + 1, currentTicketId: ticket})
    return;
  }
  await ctx.api.sendMessage(ctx.from.id, message)
  await ctx.api.sendPoll(
    ctx.from.id,
    choiseMessage[currentUser.lang],
    fixedAnswers,
    {
      type: 'quiz',
      correct_option_id: correctAnswerId,
      is_anonymous: false,
      open_period: 60,
    }
  )
  await User.updateOne({ id: ctx.from.id }, { currentQuestionId: currentUser.currentQuestionId + 1, currentTicketId: ticket })
  return;
}