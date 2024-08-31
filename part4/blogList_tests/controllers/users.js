const bcrypt = require('bcrypt');
const User = require('../models/user');

const createUser = async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (password.length < 3 || username.length < 3) {
    return res.status(400).json({ error: 'Username and password must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, passwordHash, name });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
};

const getAllUsers = async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1 });
    res.json(users);
  };
  
module.exports = { createUser };
module.exports = { getAllUsers };
