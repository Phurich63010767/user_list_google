import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginPage from './components/LoginPage';
import UserTable from './components/UserTable';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="244324809-c6qb4dd3trb7emrrkjla1uhq7fodru54.apps.googleusercontent.com">
      <Provider store={store}>
        <div>
          <LoginPage />
          <UserTable />
        </div>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
