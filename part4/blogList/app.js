// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { mongoUrl } = require('./utils/config'); // config.js'ten doğru şekilde import edilmelidir

const app = express();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);
  blog.save()
    .then(result => {
      response.status(201).json(result);
    });
});

module.exports = app;
