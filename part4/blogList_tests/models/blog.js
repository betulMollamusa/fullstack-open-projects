const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

blogSchema.methods.toJSON = function() {
  const blogObject = this.toObject();
  blogObject.id = blogObject._id.toString();
  delete blogObject._id;
  return blogObject;
};

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
