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
  
  author: {
    type: String,
    default: 'Art Club Team',
  },
  imageUrl: {
    type: String,
    default: '', // optional image if any
  },
 
  publishedAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('CRAFTCLUBDOMAIN', newsSchema);
