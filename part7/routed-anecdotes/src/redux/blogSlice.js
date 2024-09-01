import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    likeBlog(state, action) {
      const blog = state.find(blog => blog.id === action.payload);
      if (blog) {
        blog.votes += 1;
      }
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, addBlog, likeBlog, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer;
