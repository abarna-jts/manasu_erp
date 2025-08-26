import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    saveSummaryAttach,
    loadSummaryAttach,
    clearSummaryAttach,
} from "./photoStorage";

const reunionState = {
    rescue_name: '',
    date: '',
    report: '',
    summary_attach: [],
};

export const loadPhotosFromStorage = createAsyncThunk(
    "reunion/loadPhotos",
    async () => {
        const files = await loadSummaryAttach();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file), // preview only
        }));
    }
);

export const savePhotosToStorage = createAsyncThunk(
    "reunion/savePhotos",
    async (files) => {
        await saveSummaryAttach(files); // still save real File objects in IndexedDB
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
    ...reunionState,
};

const reunionSummarySlice = createSlice({
    name: 'reunion',
    initialState,
    reducers: {
        setReunionField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setSummaryAttach(state, action) {
            state.summary_attach = action.payload;
            
        },
        resetAll() {
            return initialState;
        },
        resetReunionSummary(state) {
            Object.keys(reunionState).forEach(f => {
                state[f] = reunionState[f];
            });
            clearSummaryAttach();
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPhotosFromStorage.fulfilled, (state, action) => {
                state.summary_attach = action.payload;
            })
            .addCase(savePhotosToStorage.fulfilled, (state, action) => {
                state.summary_attach = action.payload;
            });
    },
});

export const {
    setReunionField,
    resetAll,
    resetReunionSummary,
    setSummaryAttach,
} = reunionSummarySlice.actions;

export default reunionSummarySlice.reducer;
