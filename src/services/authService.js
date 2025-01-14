import { googleLogout } from '@react-oauth/google';
import { login, logout } from '../redux/authSlice';

export const handleLoginSuccess = (response, dispatch) => {
  console.log('Login Success:', response);
  const { credential } = response; 
  const decoded = JSON.parse(atob(credential.split('.')[1])); 
  const { name, picture } = decoded;

  dispatch(
    login({
      isLoggedIn: true,
      userInfo: { name, picture },
    })
  );
};

export const handleLoginFailure = (error) => {
  console.error('Login Failed:', error);
};

export const handleLogout = (dispatch) => {
  googleLogout();
  dispatch(logout());
};
