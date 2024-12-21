import { InlineKeyboard } from "grammy";


export const sendQuestion = async (ctx, question) => {

  if(!question){
    ctx.session.questions = null
    ctx.session.currentQuestionId = 0
    const elapsedTime = Math.floor((Date.now() - ctx.session.startTime) / 1000); 
    ctx.session.startTime = null
    await ctx.reply(`Barcha savollar tugadi! 🎉\n`);
    return await ctx.reply(
      `Test davomiyligi ⏰: ${elapsedTime} sekund\n` +
      `To'g'ri javoblar ✅: ${ctx.session.correctAnswers}\n` +
      `Noto'g'ri javoblar ❌: ${ctx.session.incorrectAnswers}`
    );
}

  let choiseCount = 1;
  let message = '';
  const keyboard = new InlineKeyboard();

  for (let choice of question.choices) {
    message += `${choiseCount}) ${choice.text}\n\n`;
    keyboard.text(`${choiseCount}`, `answer=${question.id}=${choiseCount - 1}`);
    choiseCount++;
  }

  const finalMessage = question.question + '\n\n' + message

  if (question.media.exist) {
    const imageUrl = process.env.IMAGES_LINK + `${question.media.name}.png`;
    return await ctx.replyWithPhoto(imageUrl, {
      caption: finalMessage,
      reply_markup: keyboard,
    });
  } 
    
  return await ctx.reply(finalMessage, {
      reply_markup: keyboard,
  })
}

