const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  completed: Boolean,
}, { timestamps: true }); // Added timestamps for createdAt/updatedAt

module.exports = mongoose.model('Todo', todoSchema);