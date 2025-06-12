// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Try to get persisted user from localStorage
const storedUser = localStorage.getItem('authUser');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('authUser', JSON.stringify(action.payload)); // save to localStorage
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('authUser'); // remove from localStorage
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
