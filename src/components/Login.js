import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from "antd";
import { login, logout } from '../redux/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    const { credential } = response; // JWT token
    const decoded = JSON.parse(atob(credential.split('.')[1])); // Decode JWT
    const { name, picture } = decoded;

    // อัปเดต Redux state ด้วยข้อมูลผู้ใช้
    dispatch(
      login({
        isLoggedIn: true,
        userInfo: { name, picture },
      })
    );
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const handleLogoutClick = () => {
    googleLogout();
    dispatch(logout()); 
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

  const renderProfilePicture = (photo) => (
    <img
      src={photo}
      alt="Profile"
      style={{ width: '100px', height: '100px', borderRadius: '50%' }}
    />
  );

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1>Welcome, {userInfo.name}!</h1>
      {renderProfilePicture(userInfo.picture)}
      <div style={{ marginTop: '20px' }}>
        <Button onClick={handleLogoutClick}>Logout</Button>
      </div>
    </div>
  );
};

export default Login;
