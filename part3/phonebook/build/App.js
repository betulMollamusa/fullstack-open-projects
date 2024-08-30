import React, { useState, useEffect } from 'react';
import personService from './services/personService';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const handleAddPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    personService.create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <form onSubmit={handleAddPerson}>
        <div>
          Name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          Number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <button type="submit">Add</button>
      </form>
      {/* Listedeki diğer bileşenler */}
    </div>
  );
};

export default App;
