import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return undefined; 
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: preloadedState, 
  },
});

store.subscribe(() => {
  saveState(store.getState().auth);
});

export default store;
