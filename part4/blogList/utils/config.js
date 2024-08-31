require('dotenv').config();

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/bloglist';
const PORT = process.env.PORT || 3001;

module.exports = { mongoUrl, PORT };
