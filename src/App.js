import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './components/Login';
import UserTable from './components/UserTable';
import { useSelector } from 'react-redux';

const AppContent = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div>
      <Login />
      {isLoggedIn ? <UserTable /> : null}
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId="244324809-c6qb4dd3trb7emrrkjla1uhq7fodru54.apps.googleusercontent.com">
        <AppContent />
      </GoogleOAuthProvider>
    </Provider>
  );
};

export default App;
