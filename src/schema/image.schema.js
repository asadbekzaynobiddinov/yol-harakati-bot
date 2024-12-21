import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { 
    type: mongoose.Schema.Types.Buffer,
    required: true 
  },
  contentType: { 
    type: String,
    required: true 
  }
})

export const Image = mongoose.model('image', imageSchema);