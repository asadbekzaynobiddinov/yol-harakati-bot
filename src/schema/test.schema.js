import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answer: { type: Boolean, required: true },
});

const mediaSchema = new mongoose.Schema({
  exist: { type: Boolean, required: true },
  name: { type: String, required: false },
});

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  choices: { type: [choiceSchema], required: true },
  media: { type: mediaSchema, required: false },
  description: { type: String, required: false },
});

export const getModel = (lang) => {
  return mongoose.model(`savollar_${lang}`, questionSchema);
};
