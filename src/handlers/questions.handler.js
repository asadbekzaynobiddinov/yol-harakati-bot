import { InlineKeyboard } from "grammy";


export const sendQuestion = async (ctx, question) => {
  try {
    if (!question) {
      let formattedTime;
      let elapsedTime
      if(ctx.session.startTime){
        ctx.session.questions = null;
        ctx.session.currentQuestionId = 0;
        elapsedTime = Math.floor((Date.now() - ctx.session.startTime) / 1000);
        ctx.session.startTime = null;
    
        if (elapsedTime >= 3600) {
            const hours = Math.floor(elapsedTime / 3600);
            const minutes = Math.floor((elapsedTime % 3600) / 60);
            const seconds = elapsedTime % 60;
            formattedTime = `${hours} soat ${minutes} minut ${seconds} sekund`;
        } else if (elapsedTime >= 60) {
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;
            formattedTime = `${minutes} minut ${seconds} sekund`;
        } else {
            formattedTime = `${elapsedTime} sekund`;
        }
      }
  
      await ctx.reply(`Barcha savollar tugadi! 🎉\n`);
      return await ctx.reply(
          `Test davomiyligi ⏰: ${formattedTime || 0}\n` +
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
  
    const finalMessage = `[${ctx.session.currentQuestionId + 1}/${ctx.session.questions.length}] - savol ❓\n` + question.question + '\n\n' + message
  
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
  } catch (error) {
    console.log(error.message)
  }
}

