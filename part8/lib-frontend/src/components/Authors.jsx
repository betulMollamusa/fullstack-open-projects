import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { ALL_AUTHORS, SET_BIRTHYEAR } from './queries.js';

const Authors = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [setBirthYear] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const [name, setName] = useState('');
  const [birthYear, setBirthYearState] = useState('');

  if (!show) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const submit = (event) => {
    event.preventDefault();
    setBirthYear({ variables: { name, setBornTo: parseInt(birthYear) } });
    setName('');
    setBirthYearState('');
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || 'N/A'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3>Set birth year</h3>
        <form onSubmit={submit}>
          <div>
            name
            <select value={name} onChange={({ target }) => setName(target.value)}>
              {data.allAuthors.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            born
            <input
              type="number"
              value={birthYear}
              onChange={({ target }) => setBirthYearState(target.value)}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
