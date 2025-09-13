import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    saveScanReport,
    loadScanReport,
    clearScanReport,
} from "./photoStorage";


const mediaConsentState = {
    rescue_name: '',
    social_media_consent: '',
    description: '',
}

export const loadScanReportFromStorage = createAsyncThunk(
    "observation/loadScanReport",
    async () => {
        const files = await loadScanReport();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file), // preview only
        }));
    }
);

export const saveScanReportToStorage = createAsyncThunk(
    "observation/saveScanReport",
    async (files) => {
        await saveScanReport(files); // still save real File objects in IndexedDB
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
    rescue_name: '',
};

const initialState = {
    ...baseState,
    ...mediaConsentState,
    scan_report: [],
}


const mediaConsentSlice = createSlice({
    name: 'media_consent',
    initialState,

    reducers: {
        setMediaConsentField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setScanReport(state, action) {
            state.scan_report = action.payload;
            // save to localStorage so it survives refresh
            // localStorage.setItem("recovery_photo", JSON.stringify(action.payload));
        },
        resetAll() {
            return initialState;
        },
        resetMediaConsentData(state) {
            Object.keys(mediaConsentState).forEach(f => {
                state[f] = mediaConsentState[f];
            });
            clearScanReport();
        },
        clearMediaConsentImages: (state) => {
            state.scan_report = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadScanReportFromStorage.fulfilled, (state, action) => {
                state.scan_report = action.payload;
            })
            .addCase(saveScanReportToStorage.fulfilled, (state, action) => {
                state.scan_report = action.payload;
            });
    },
});


export const {
    setMediaConsentField,
    resetAll,
    resetMediaConsentData,
    setScanReport,
    clearMediaConsentImages
} = mediaConsentSlice.actions;

export default mediaConsentSlice.reducer;