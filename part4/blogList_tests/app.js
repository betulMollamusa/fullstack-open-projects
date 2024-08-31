//const mongoose = require('mongoose');
//const config = require('./utils/config.js'); // .env dosyasından okunan yapılandırmalar
const express = require('express');
const app = express();
const tokenExtractor = require('./middleware/tokenExtractor');
const userExtractor = require('./middleware/userExtractor');
const blogsRouter = require('./routes/blogs');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');


/*mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });*/

  
  app.use(express.json());
  app.use(tokenExtractor);
  
  app.use('/api/blogs', blogsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/login', loginRouter);

  app.use('/api/blogs', userExtractor, blogsRouter);
  
  module.exports = app;
  





//app.use(express.json());
//app.use('/api/blogs', blogsRouter);

//module.exports = app;
