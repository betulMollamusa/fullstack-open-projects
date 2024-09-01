// src/reducers/anecdoteReducer.js
const initialState = []

export const voteForAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = (content) => {
  return {
    type: 'CREATE',
    data: { content }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE': {
      const id = action.data.id
      const anecdoteToVote = state.find(a => a.id === id)
      const votedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
      return state.map(a => a.id !== id ? a : votedAnecdote)
    }
    case 'CREATE': {
      return [...state, { ...action.data, id: getId(), votes: 0 }]
    }
    default:
      return state
  }
}

const getId = () => (100000 * Math.random()).toFixed(0)

export default reducer
