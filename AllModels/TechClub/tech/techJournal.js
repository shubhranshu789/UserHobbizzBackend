const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, 
    required: true,
  },
  category: {
    type: String,
    enum: ['Book', 'Article', 'Research', 'Other'],
    default: 'Other',
  },
  author: {
    type: String,
    default: 'Tech Club Team',
  },
  imageUrl: {
    type: String,
    default: '', // optional image if any
  },
  tags: [String], // e.g. ["students", "awards"]
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('TECHCLUBJOURNAL', newsSchema);
