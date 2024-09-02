const { ApolloServer, AuthenticationError, UserInputError } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');


const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const JWT_SECRET = 'rain'; 

const app = express();

app.use(cors()); 

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: async (root, args) => {
      let filteredBooks = Book.find().populate('author');
      
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        filteredBooks = filteredBooks.find({ author: author._id });
      }

      if (args.genre) {
        filteredBooks = filteredBooks.find({ genres: args.genre });
      }

      return filteredBooks;
    },
    allAuthors: async () => {
      const authors = await Author.find();
      return authors.map(async (author) => ({
        ...author._doc,
        bookCount: (await Book.find({ author: author._id })).length,
      }));
    },
    me: (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      return User.findById(currentUser.id);
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const author = await Author.findOne({ name: args.author });
      if (!author) {
        return null;
      }
      const newBook = new Book({ ...args, author: author._id });
      await newBook.save();
      return newBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      await author.save();
      return author;
    },
    createUser: async (root, args) => {
      const passwordHash = await bcrypt.hash('password', 10);  // Tüm kullanıcılar için aynı şifreyi ayarla
      const user = new User({ ...args, passwordHash });
      await user.save();
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user) {
        throw new UserInputError('wrong credentials');
      }

      const correctPassword = await bcrypt.compare(args.password, user.passwordHash);
      if (!correctPassword) {
        throw new UserInputError('wrong credentials');
      }

      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
      return { value: token };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers.authorization || '';
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.replace('Bearer ', '');
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        return { currentUser: decodedToken };
      } catch (error) {
        return { currentUser: null };
      }
    }
    return { currentUser: null };
  }
});

mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true });

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
