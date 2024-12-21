import { sendQuestion } from "../handlers/questions.handler.js";
import { ticketsKey } from "../keyboards/index.js";
import { Question } from "../schema/test.schema.js";


export const callbackQuery = async (ctx) => {

  const callbackData = ctx.update.callback_query.data
  const [command, param, choiseId] = callbackData.split('=')

  switch (command) {

    case 'prev':
      try {
        if (ctx.session.page == 1) {
          return ctx.answerCallbackQuery({
            text: "Siz ro'yxatning boshidasiz",
            show_alert: true,
          })
        }
        ctx.session.page = Math.max(1, (ctx.session.page || 1) - 1);
        await ticketsKey(ctx, true)
      } catch (error) {
        console.log(error.message)
      }
      break;


    case 'next':
      try {
        if (ctx.session.page == 7) {
          return ctx.answerCallbackQuery({
            text: "Siz ro'yxatning oxiridasiz",
            show_alert: true,
          })
        }
        ctx.session.page = Math.max(1, (ctx.session.page || 1) + 1);
        await ticketsKey(ctx, true)
      } catch (error) {
        console.log(error.message)
      }
      break;


    case 'ticket':
      try {
        const page = +param
        const skip = (page - 1) * 10
        ctx.session.questions = await Question.find().skip(skip).limit(10)
        ctx.session.currentQuestionId = 0
        await sendQuestion(ctx, ctx.session.questions[ctx.session.currentQuestionId])
      } catch (error) {
        console.log(error.message)
      }
      break;


    case 'answer':
     try {
       await ctx.editMessageReplyMarkup()
       const id = +param
       const currentQuestion = await Question.findOne({ id })
 
       if (!ctx.session.startTime) {
         ctx.session.startTime = Date.now();
         ctx.session.correctAnswers = 0;
         ctx.session.incorrectAnswers = 0;
       }
 
       let message
       if (currentQuestion.choices[choiseId].answer) {
         ctx.session.correctAnswers++
         message =
           `✅ Javob to'g'ri\n` +
           `👮🏻‍♂️ Yodda tuting \n` + 
           `${currentQuestion.description}`
         await ctx.reply(message)
       } else {
         ctx.session.incorrectAnswers++
         await ctx.reply(
           `❌ Javob xato\n` +
           `${currentQuestion.description}`
         )
       }
       ctx.session.currentQuestionId += 1
       await sendQuestion(ctx, ctx.session.questions[ctx.session.currentQuestionId])
       break;
     } catch (error) {
      console.log(error.message)
     }
    default:
      break;
  }
}