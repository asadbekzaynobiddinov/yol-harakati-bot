import { InlineKeyboard } from "grammy";
import mongoose from "mongoose";
import { User } from "../schema/users.schema.js";
import { checkUser } from "./check.js";

export const test10 = async (ctx) => {
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

  const skip = Math.floor(Math.random() * 700);

  const [question] = await mongoose.connection.db
    .collection(`savollar_${currentUser.lang}`)
    .find()
    .skip(skip)
    .limit(1)
    .toArray();

  const questionLang = {
    uz: "Savol",
    kr: "Савол",
    ru: "Вопрос",
  };

  const startQuizMessage = {
    uz: "Test boshlandi.",
    kr: "Тест бошланди.",
    ru: "Вопросы начались.",
  };

  const questionText =
    `[${currentUser.currentQuestionId + 1} / 10] - ${questionLang[currentUser.lang]}\n` +
    question.question;
  const answers = question.choices.map((choice) => choice.text);
  const correctAnswerId = question.choices.findIndex(
    (choice) => choice.answer === true
  );

  const lt300 = questionText.length <= 300;
  const lt100 = answers.every((answer) => answer.length <= 100);

  await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    startQuizMessage[currentUser.lang]
  );

  if (lt300 && lt100) {
    if (question.media.exist) {
      await ctx.api.sendPhoto(
        ctx.from.id,
        process.env.IMAGE_URL + `${question.media.name}.png`
      );
    }

    await ctx.api.sendPoll(ctx.from.id, questionText, answers, {
      type: "quiz",
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    });
    await User.updateOne(
      { id: ctx.from.id },
      {
        currentQuestionId: currentUser.currentQuestionId + 1,
        quizStatus: "10test",
      }
    );
    return;
  }

  const message = `${questionText}\n\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n\n")}`;

  const choiseMessage = {
    uz: "Birini tanlang: ",
    kr: "Бирини танланг: ",
    ru: "Выберите один: ",
  };

  const fixedAnswers = answers.map((answer, index) => `${index + 1}.`);

  if (question.media.exist) {
    await ctx.api.sendPhoto(
      ctx.from.id,
      process.env.IMAGE_URL + `${question.media.name}.png`,
      {
        caption: message,
      }
    );
    await ctx.api.sendPoll(
      ctx.from.id,
      choiseMessage[currentUser.lang],
      fixedAnswers,
      {
        type: "quiz",
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    );
    await User.updateOne(
      { id: ctx.from.id },
      {
        currentQuestionId: currentUser.currentQuestionId + 1,
        quizStatus: "10test",
      }
    );
    return;
  }
  await ctx.api.sendMessage(ctx.from.id, message);
  await ctx.api.sendPoll(
    ctx.from.id,
    choiseMessage[currentUser.lang],
    fixedAnswers,
    {
      type: "quiz",
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    }
  );
  await User.updateOne(
    { id: ctx.from.id },
    {
      currentQuestionId: currentUser.currentQuestionId + 1,
      quizStatus: "10test",
    }
  );
  return;
};

export const test20 = async (ctx) => {
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

  const skip = Math.floor(Math.random() * 700);

  const [question] = await mongoose.connection.db
    .collection(`savollar_${currentUser.lang}`)
    .find()
    .skip(skip)
    .limit(1)
    .toArray();

  const questionLang = {
    uz: "Savol",
    kr: "Савол",
    ru: "Вопрос",
  };

  const startQuizMessage = {
    uz: "Test boshlandi.",
    kr: "Тест бошланди.",
    ru: "Вопросы начались.",
  };

  const questionText =
    `[${currentUser.currentQuestionId + 1} / 20] - ${questionLang[currentUser.lang]}\n` +
    question.question;
  const answers = question.choices.map((choice) => choice.text);
  const correctAnswerId = question.choices.findIndex(
    (choice) => choice.answer === true
  );

  const lt300 = questionText.length <= 300;
  const lt100 = answers.every((answer) => answer.length <= 100);

  await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    startQuizMessage[currentUser.lang]
  );

  if (lt300 && lt100) {
    if (question.media.exist) {
      await ctx.api.sendPhoto(
        ctx.from.id,
        process.env.IMAGE_URL + `${question.media.name}.png`
      );
    }

    await ctx.api.sendPoll(ctx.from.id, questionText, answers, {
      type: "quiz",
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    });
    await User.updateOne(
      { id: ctx.from.id },
      {
        currentQuestionId: currentUser.currentQuestionId + 1,
        quizStatus: "20test",
      }
    );
    return;
  }

  const message = `${questionText}\n\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n\n")}`;

  const choiseMessage = {
    uz: "Birini tanlang: ",
    kr: "Бирини танланг: ",
    ru: "Выберите один: ",
  };

  const fixedAnswers = answers.map((answer, index) => `${index + 1}.`);

  if (question.media.exist) {
    await ctx.api.sendPhoto(
      ctx.from.id,
      process.env.IMAGE_URL + `${question.media.name}.png`,
      {
        caption: message,
      }
    );
    await ctx.api.sendPoll(
      ctx.from.id,
      choiseMessage[currentUser.lang],
      fixedAnswers,
      {
        type: "quiz",
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    );
    await User.updateOne(
      { id: ctx.from.id },
      {
        currentQuestionId: currentUser.currentQuestionId + 1,
        quizStatus: "20test",
      }
    );
    return;
  }
  await ctx.api.sendMessage(ctx.from.id, message);
  await ctx.api.sendPoll(
    ctx.from.id,
    choiseMessage[currentUser.lang],
    fixedAnswers,
    {
      type: "quiz",
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    }
  );
  await User.updateOne(
    { id: ctx.from.id },
    {
      currentQuestionId: currentUser.currentQuestionId + 1,
      quizStatus: "20test",
    }
  );
  return;
};

export const randomTest = async (ctx) => {
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
  await User.updateOne({ id: ctx.from.id }, { quizStatus: "random" });

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

  const questionLang = {
    uz: "Savol",
    kr: "Савол",
    ru: "Вопрос",
  };

  const startQuizMessage = {
    uz: "Test boshlandi.",
    kr: "Тест бошланди.",
    ru: "Вопросы начались.",
  };

  await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    startQuizMessage[currentUser.lang]
  );
  const randomSkip = Math.floor(Math.random() * 700);
  const [question] = await mongoose.connection.db
    .collection(`savollar_${currentUser.lang}`)
    .find()
    .skip(randomSkip)
    .limit(1)
    .toArray();
  const questionText =
    `[${question.id}] - ${questionLang[currentUser.lang]}\n` +
    question.question;
  const answers = question.choices.map((choice) => choice.text);
  const correctAnswerId = question.choices.findIndex(
    (choice) => choice.answer === true
  );

  const lt300 = questionText.length <= 300;
  const lt100 = answers.every((answer) => answer.length <= 100);

  if (lt300 && lt100) {
    if (question.media.exist) {
      await ctx.api.sendPhoto(
        ctx.from.id,
        process.env.IMAGE_URL + `${question.media.name}.png`
      );
    }

    await ctx.api.sendPoll(ctx.from.id, questionText, answers, {
      type: "quiz",
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    });
    return;
  }

  const message = `${questionText}\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n\n")}`;
  const fixedAnswers = answers.map((answer, index) => `${index + 1}.`);

  const choiseMessage = {
    uz: "Birini tanlang: ",
    kr: "Бирини танланг: ",
    ru: "Выберите один: ",
  };

  if (question.media.exist) {
    await ctx.api.sendPhoto(
      ctx.from.id,
      process.env.IMAGE_URL + `${question.media.name}.png`,
      {
        caption: message,
      }
    );

    await ctx.api.sendPoll(
      ctx.from.id,
      choiseMessage[currentUser.lang],
      fixedAnswers,
      {
        type: "quiz",
        correct_option_id: correctAnswerId,
        is_anonymous: false,
      }
    );
    return;
  }

  await ctx.api.sendMessage(ctx.from.id, message);

  await ctx.api.sendPoll(
    ctx.from.id,
    choiseMessage[currentUser.lang],
    fixedAnswers,
    {
      type: "quiz",
      correct_option_id: correctAnswerId,
      is_anonymous: false,
    }
  );
  return;
};
