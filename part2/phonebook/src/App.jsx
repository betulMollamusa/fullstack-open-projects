import React, { useState, useEffect } from 'react'
import personService from './services/personService'
import './index.css'

const Notification = ({ notify }) => {
  if (notify === null) {
    return null
  }
  const { message, className } = notify
  return (
    <div className={`notification ${className}`}>
      {message}
    </div>
  )
}

const Persons = ({ filterPersons, handleDelete }) => {
  return filterPersons.map((person) => (
    <p key={person.id}>
      {person.name} {person.number} 
      <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
    </p>
  ))
}

const PersonForm = ({ setPersons, persons, setMessage }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleSubmit = (event) => {
    event.preventDefault()

    const newPhonebook = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(newPhonebook, existingPerson.id)
          .then((returnedPerson) => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
            setMessage({ message: `Updated ${returnedPerson.name}`, className: 'success' })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch((error) => {
            setMessage({
              message: `Information of ${existingPerson.name} has already been removed from server`,
              className: 'error'
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
    } else {
      personService
        .create(newPhonebook)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setMessage({ message: `Added ${returnedPerson.name}`, className: 'success' })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setMessage({
            message: error.response.data.error || "Failed to add person",
            className: 'error'
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [filterPersons, setFilterPersons] = useState(persons)
  const [message, setMessage] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setFilterPersons(persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage({ message: `Deleted ${name}`, className: 'success' })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setMessage({
            message: `Information of ${name} has already been removed from server`,
            className: 'error'
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  useEffect(() => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input onChange={handleFilterChange} value={filter}></input>
      </div>
      <Notification notify={message} />
      <h2>add a new</h2>
      <PersonForm setPersons={setPersons} setMessage={setMessage} persons={persons} />
      <h2>Numbers</h2>
      {filter === '' ? <Persons handleDelete={handleDelete} filterPersons={persons} /> : <Persons handleDelete={handleDelete} filterPersons={filterPersons} />}
    </div>
  )
}

export default App
