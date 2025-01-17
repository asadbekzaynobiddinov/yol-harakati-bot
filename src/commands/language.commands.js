import { User } from "../schema/users.schema.js";
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

  const message = {
    uz: 'Kerakli tilni tanlang: 🇺🇿',
    kr: 'Керакли тилни танланг: 🇺🇿',
    ru: 'Выберите нужный язык: 🇷🇺',
  }

  ctx.session.lastMessage = await ctx.api.editMessageText(
    ctx.from.id,
    ctx.update.callback_query.message.message_id,
    message[currentUser.lang], {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🇺🇿 O\'zbekcha', callback_data: 'uz' }],
        [{ text: '🇺🇿 Узбекча', callback_data: 'kr' }],
        [{ text: '🇷🇺 Русский', callback_data: 'ru' }],
      ],
    },
  });
  return;
} 

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
      first_name: ctx.from.first_name || 'unknown',
      last_name: ctx.from.last_name || 'unknown',
      username: ctx.from.username || 'unknown',
      lang,
    });
    startCommand(ctx);
    return;
  }

  currentUser.lang = lang;
  await currentUser.save();
  startCommand(ctx);
};
