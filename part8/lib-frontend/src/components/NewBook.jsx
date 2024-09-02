import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from './queries.js';

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genres, setGenres] = useState('');
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });

  if (!show) return null;

  const submit = async (event) => {
    event.preventDefault();
    addBook({ variables: { title, author, published: parseInt(published), genres: genres.split(',') } });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres('');
  };

  return (
    <div>
      <h2>Add a new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          genres (comma separated)
          <input
            value={genres}
            onChange={({ target }) => setGenres(target.value)}
          />
        </div>
        <button type="submit">add book</button>
      </form>
    </div>
  );
};

export default NewBook;
