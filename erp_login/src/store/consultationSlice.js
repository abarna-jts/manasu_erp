import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    saveConsultationRecoveryPhoto,
    loadConsultationRecoveryPhoto,
    clearConsultationRecoveryPhoto,
} from "./photoStorage";

const consultationState = {
    admission_no: '',
    resident_name: '',
    date: '',
    follow_up: '',
};

export const loadPhotosFromStorage = createAsyncThunk(
    "consultation/loadPhotos",
    async () => {
        const files = await loadConsultationRecoveryPhoto();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file), // preview only
        }));
    }
);

export const savePhotosToStorage = createAsyncThunk(
    "consultation/savePhotos",
    async (files) => {
        await saveConsultationRecoveryPhoto(files); // still save real File objects in IndexedDB
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
    date: '',
};

const initialState = {
    ...baseState,
    ...consultationState
};

const consultationSlice = createSlice({
    name: 'cosultation',
    initialState,
    reducers: {
        setConsultationField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setConsultationPhoto(state, action) {
            state.rescue_recovery_photo = action.payload;

        },
        resetAll() {
            return initialState;
        },
        resetConsultation(state) {
            Object.keys(consultationState).forEach(f => {
                state[f] = consultationState[f];
            });
            clearConsultationRecoveryPhoto();
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPhotosFromStorage.fulfilled, (state, action) => {
                state.rescue_recovery_photo = action.payload;
            })
            .addCase(savePhotosToStorage.fulfilled, (state, action) => {
                state.rescue_recovery_photo = action.payload;
            });
    },
});

export const {
    setConsultationField,
    setConsultationPhoto,
    resetAll,
    resetConsultation
} = consultationSlice.actions;

export default consultationSlice.reducer;
