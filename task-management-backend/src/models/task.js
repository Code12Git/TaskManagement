const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  dueDate: {
    type: Date,
    required:true,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'not-started'],
    default: 'not-started'
  },
}, { 
  timestamps: true 
});
module.exports = mongoose.model('Task', taskSchema);