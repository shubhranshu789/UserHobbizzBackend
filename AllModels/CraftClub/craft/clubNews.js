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
    enum: ['Achievements', 'Notices', 'Events', 'Press Coverage', 'Other'],
    default: 'Other',
  },
  author: {
    type: String,
    default: 'Art Club Team',
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

module.exports = mongoose.model('CRAFTCLUBNEWS', newsSchema);
