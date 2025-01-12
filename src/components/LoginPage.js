import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { login, logout } from '../redux/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    dispatch(login()); // อัปเดตสถานะการล็อกอินใน Redux
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const handleLogoutClick = () => {
    googleLogout();
    dispatch(logout()); // อัปเดตสถานะการล็อกเอาต์ใน Redux
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Please Login with Google</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1>Welcome to the User List Dashboard</h1>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default LoginPage;
