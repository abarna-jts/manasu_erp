import { configureStore } from '@reduxjs/toolkit';
import admissionReducer from './admissionSlice';
import psychiatricReducer from './psychiatricSlice';

const STORAGE_KEYS = {
  admission: 'admissionState',
  psychiatric: 'psychiatricState',
};

// Load from localStorage
const loadState = () => {
  try {
    const admission = localStorage.getItem(STORAGE_KEYS.admission);
    const psychiatric = localStorage.getItem(STORAGE_KEYS.psychiatric);

    return {
      admission: admission ? JSON.parse(admission) : undefined,
      psychiatric: psychiatric ? JSON.parse(psychiatric) : undefined,
    };
  } catch {
    return undefined;
  }
};

// Save to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEYS.admission, JSON.stringify(state.admission));
    localStorage.setItem(STORAGE_KEYS.psychiatric, JSON.stringify(state.psychiatric));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    admission: admissionReducer,
    psychiatric: psychiatricReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

export default store;
