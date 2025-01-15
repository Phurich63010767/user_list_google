import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from "antd";
import { handleLoginSuccess, handleLoginFailure, handleLogout } from '../services/authService';

const Login = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return (
      <div style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        gap: "20px",
      }}>
        <h1>Please Login with Google</h1>
        <div>
          <GoogleLogin
          onSuccess={(response) => handleLoginSuccess(response, dispatch)}
          onError={handleLoginFailure}
        />
        </div>
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
        <Button onClick={() => handleLogout(dispatch)}>Logout</Button>
      </div>
    </div>
  );
};

export default Login;
