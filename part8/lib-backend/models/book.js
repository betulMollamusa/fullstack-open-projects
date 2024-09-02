const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  published: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [String],
});

module.exports = mongoose.model('Book', bookSchema);
