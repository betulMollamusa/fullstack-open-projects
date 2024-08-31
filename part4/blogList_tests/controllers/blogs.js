const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
//const router = express.Router();
const jwt = require('jsonwebtoken');

/*router.post('/', async (req, res) => {
  try {
    const body = req.body;

    if (!body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!body.url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author || 'Unknown',
      url: body.url,
      likes: body.likes || 0,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the blog' });
  }
});*/

/*router.post('/', async (req, res) => {
  const { title, author, url, likes = 0 } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const blog = new Blog({ title, author, url, likes });

  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving the blog' });
  }
});*/

// DELETE /api/blogs/:id
/*router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBlog = await Blog.findByIdAndRemove(id);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error during DELETE operation:', error); // Hata mesajını konsola yazdır
    res.status(500).json({ error: 'An error occurred while deleting the blog' });
  }
});*/

/*router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { likes } = req.body;

  if (likes === undefined) {
    return res.status(400).json({ error: 'Likes property is missing' });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    console.error('Error during PUT operation:', error.message); // Hata mesajını ayrıntılı olarak yazdır
    res.status(500).json({ error: 'An error occurred while updating the blog' });
  }
});*/

const addBlog = async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  if (!req.token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: decodedToken.id,
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
};

module.exports = { addBlog };

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  if (!req.token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await Blog.findByIdAndRemove(id);
  res.status(204).end();
};

module.exports = { deleteBlog };

//module.exports = router;
