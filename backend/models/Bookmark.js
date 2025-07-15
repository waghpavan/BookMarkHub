const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: String,
    favicon: String,
    summary: String,
    tags: {
      type: [String],
      default: [],
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder', // ✅ New optional reference
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
