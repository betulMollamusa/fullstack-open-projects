// src/components/AnecdoteForm.jsx
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const [content, setContent] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(createAnecdote(content))
    setContent('')
  }

  return (
    <div>
      <h3>Add a new anecdote</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
