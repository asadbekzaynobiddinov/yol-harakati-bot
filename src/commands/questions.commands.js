import { getModel } from "../schema/test.schema.js";

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
};