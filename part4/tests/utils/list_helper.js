// utils/list_helper.js

const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
    return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])
  }
  
  const mostBlogs = (blogs) => {
    const authorCounts = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1
      return counts
    }, {})
  
    const maxAuthor = Object.keys(authorCounts).reduce((max, author) =>
      authorCounts[author] > (authorCounts[max] || 0) ? author : max
    )
  
    return {
      author: maxAuthor,
      blogs: authorCounts[maxAuthor]
    }
  }
  
  const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((likes, blog) => {
      likes[blog.author] = (likes[blog.author] || 0) + blog.likes
      return likes
    }, {})
  
    const maxAuthor = Object.keys(authorLikes).reduce((max, author) =>
      authorLikes[author] > (authorLikes[max] || 0) ? author : max
    )
  
    return {
      author: maxAuthor,
      likes: authorLikes[maxAuthor]
    }
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  