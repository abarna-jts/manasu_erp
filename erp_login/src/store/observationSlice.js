import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    saveRecoveryPhotos,
    loadRecoveryPhotos,
    clearRecoveryPhotos,
} from "./photoStorage";


const observationState = {
    admission_no: '',
    resident_name: '',
    follow_up: '',
    date: '',
}

export const loadPhotosFromStorage = createAsyncThunk(
  "observation/loadPhotos",
  async () => {
    const files = await loadRecoveryPhotos();
    return files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file), // preview only
    }));
  }
);

export const savePhotosToStorage = createAsyncThunk(
  "observation/savePhotos",
  async (files) => {
    await saveRecoveryPhotos(files); // still save real File objects in IndexedDB
    return files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file), // only store metadata + preview
    }));
  }
);


const baseState = {
    admission_no: '',
    resident_name: '',
};

const initialState = {
    ...baseState,
    ...observationState,
    recovery_photo: [],
}


const observationSlice = createSlice({
    name: 'observation',
    initialState,
    
    reducers: {
        setObservationField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setRecoveryPhoto(state, action) {
            state.recovery_photo = action.payload;
            // save to localStorage so it survives refresh
            // localStorage.setItem("recovery_photo", JSON.stringify(action.payload));
        },
        resetAll() {
            return initialState;
        },
        resetObservationData(state) {
            Object.keys(observationState).forEach(f => {
                state[f] = observationState[f];
            });
            clearRecoveryPhotos();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPhotosFromStorage.fulfilled, (state, action) => {
                state.recovery_photo = action.payload;
            })
            .addCase(savePhotosToStorage.fulfilled, (state, action) => {
                state.recovery_photo = action.payload;
            });
    },
});


export const {
    setObservationField,
    resetAll,
    resetObservationData,
    setRecoveryPhoto,
} = observationSlice.actions;

export default observationSlice.reducer;