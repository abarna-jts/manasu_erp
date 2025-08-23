import { configureStore } from '@reduxjs/toolkit';
import admissionReducer from './admissionSlice';
import psychiatricReducer from './psychiatricSlice';
import MSEReducer from './MSESlice';
import observationReducer from './observationSlice';

const STORAGE_KEYS = {
  admission: 'admissionState',
  psychiatric: 'psychiatricState',
  mse: 'mseState',
  observation: 'observationState',
};

// Load from localStorage
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const makeStored = data => ({
  value: data,
  savedAt: Date.now(),
});

const isExpired = savedAt => Date.now() - savedAt > EXPIRY_MS;

// Load from localStorage with expiry check
const loadState = () => {
  try {
    const admissionRaw = localStorage.getItem(STORAGE_KEYS.admission);
    const psychiatricRaw = localStorage.getItem(STORAGE_KEYS.psychiatric);
    const MSERaw = localStorage.getItem(STORAGE_KEYS.mse);
    const ObservationRaw = localStorage.getItem(STORAGE_KEYS.observation);

    const parse = raw => {
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.savedAt === 'number') {
        if (isExpired(parsed.savedAt)) {
          return undefined; // expired
        }
        return parsed.value;
      }
      // fallback if old format (no expiry info)
      return parsed;
    };

    return {
      admission: parse(admissionRaw),
      psychiatric: parse(psychiatricRaw),
      mse: parse(MSERaw),
      observation: parse(ObservationRaw),
    };
  } catch {
    return undefined;
  }
};

// Save to localStorage (wrap with timestamp)
const saveState = (state) => {
  try {
    if (state.admission !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.admission,
        JSON.stringify(makeStored(state.admission))
      );
    }
    if (state.psychiatric !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.psychiatric,
        JSON.stringify(makeStored(state.psychiatric))
      );
    }
    if (state.mse !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.mse,
        JSON.stringify(makeStored(state.mse))
      );
    }
    if (state.observation !== undefined) {
      localStorage.setItem(
        STORAGE_KEYS.observation,
        JSON.stringify(makeStored(state.observation))
      );
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    admission: admissionReducer,
    psychiatric: psychiatricReducer,
    mse: MSEReducer,
    observation: observationReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

export default store;
