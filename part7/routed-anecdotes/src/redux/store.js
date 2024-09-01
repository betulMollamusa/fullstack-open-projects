import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice.js';
import notificationReducer from './notificationSlice.js';
import userReducer from './userSlice.js';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

export default store;
