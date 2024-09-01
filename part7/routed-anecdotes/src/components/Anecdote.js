
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  const anecdote = anecdotes.find(a => a.id === Number(id));

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>by {anecdote.author}</p>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
    </div>
  );
};

Anecdote.propTypes = {
  anecdotes: PropTypes.array.isRequired
};

export default Anecdote;
