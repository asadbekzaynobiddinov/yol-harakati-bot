import { Keyboard, InlineKeyboard } from "grammy"

export const mainMenuKeys = async (ctx) => {
  const keyboards = new Keyboard()
    .text('Imtihon 20 👨🏼‍💻')
    .text('Imtihon 10 👨🏼‍💻')
    .row()
    .text('Biletlar 🎟')
    .text('Random Savollar 🎲')
    .resized()
  return await ctx.reply(`Kerakli bo'limni tanlang 👇🏻`, {
    reply_markup: keyboards
  })
}

export const ticketsKey = async (ctx, edit = false) => {
  const message = "Quyidagi bilet raqamlaridan tanlashingiz mumkin 😊";
  const keyboard = new InlineKeyboard();

  const page = ctx.session.page;
  const start = (page - 1) * 10 + 1;
  const end = page * 10;

  for (let i = start; i <= end; i++) {
    keyboard.text(`${i}`, `ticket=${i}`);
    if ((i - start + 1) % 5 === 0) {
      keyboard.row();
    }
  }

  keyboard
    .row()
    .text("⬅️", "prev")
    .text("❌", "close")
    .text("➡️", "next");

  if (edit) {
    await ctx.editMessageText(message, {
      reply_markup: keyboard,
    });
  } else {
    await ctx.reply(message, {
      reply_markup: keyboard,
    });
  }
};