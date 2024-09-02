const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  born: Number,
});

module.exports = mongoose.model('Author', authorSchema);
