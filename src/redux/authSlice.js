import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    userInfo: null,
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.userInfo;
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userInfo');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;