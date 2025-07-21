const mongoose = require('mongoose');

const HeritageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['Traditional Art', 'Modern Art', 'Sculpture', 'Photography', 'Other'], // Apni categories add kar lo
      default: 'Other',
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      default: 'Ancient - Present',
    },
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CRAFTHERITAGE', HeritageSchema);