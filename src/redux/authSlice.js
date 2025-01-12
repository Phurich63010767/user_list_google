import { createSlice } from '@reduxjs/toolkit';

// ตรวจสอบสถานะการล็อกอินจาก localStorage
const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', true); // บันทึกสถานะการล็อกอินลง localStorage
    },
    logout(state) {
      state.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn'); // ลบสถานะการล็อกอินออกจาก localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
