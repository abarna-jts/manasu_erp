import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    saveFamAadharCard, saveFamRationCard, saveResAadharCard, saveResRationCard, saveGovtID,
    loadFamAadharCard, loadFamRationCard, loadResAadharCard, loadResRationCard, loadGovtID,
    clearFamAadharCard, clearFamRationCard, clearResAadharCard, clearResRationCard, clearGovtID
} from "./photoStorage";

// Initial state for the essential form fields
const familyReqState = {
    admission_no: '',
    rescue_name: '',
    age: '',
    gender: 'Male',
    phone_no: '',
    rescue_relationship: '',
    f_member_name: '',
    f_member_age: '',
    f_member_address: '',
    f_member_phone: '',
    f_aadhar_card_no: '',
    f_ration_card_no: '',
    r_aadhar_card_no: '',
    r_ration_card_no: '',
    any_other: '',
    description: '',
};

// Base state
const baseState = {
    admission_no: '',
    rescue_name: '',
    age:'',
    phone_no:''
};

// Combined initial state including file attachments
const initialState = {
    ...baseState,
    ...familyReqState,
    f_aadhar_card: [],
    f_ration_card: [],
    r_aadhar_card: [],
    r_ration_card: [],
    govt_id:[]
};


// Async thunk to load Bank Passbook files
export const loadFamAadharFromStorage = createAsyncThunk(
    "essential/loadFamAadhar",
    async () => {
        const files = await loadFamAadhar();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Bank Passbook files
export const saveFamAadharToStorage = createAsyncThunk(
    "essential/saveFamAadhar",
    async (files) => {
        await saveFamAadhar(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Aadhar Attach files
export const loadResAadharFromStorage = createAsyncThunk(
    "essential/loadResAadhar",
    async () => {
        const files = await loadResAadhar();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Aadhar Attach files
export const saveResAadharToStorage = createAsyncThunk(
    "essential/saveResAadhar",
    async (files) => {
        await saveResAadhar(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load UDID Attach files
export const loadFamRationFromStorage = createAsyncThunk(
    "essential/loadFamRation",
    async () => {
        const files = await loadFamRation();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save UDID Attach files
export const saveFamRationToStorage = createAsyncThunk(
    "essential/saveFamRation",
    async (files) => {
        await saveFamRation(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Form 7 Attach files
export const loadResRationFromStorage = createAsyncThunk(
    "essential/loadResRation",
    async () => {
        const files = await loadResRation();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Form 7 Attach files
export const saveResRationToStorage = createAsyncThunk(
    "essential/saveResRation",
    async (files) => {
        await saveResRation(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Form 7 Attach files
export const loadGovtIDFromStorage = createAsyncThunk(
    "essential/loadGovtID",
    async () => {
        const files = await loadGovtID();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Form 7 Attach files
export const saveGovtIDToStorage = createAsyncThunk(
    "essential/saveGovtID",
    async (files) => {
        await saveGovtID(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Create the slice
const familyReqSlice = createSlice({
    name: 'family_request',
    initialState,
    reducers: {
        setFamilyReqField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setFamAadhar(state, action) {
            state.f_aadhar_card = action.payload;
        },
        setFamRation(state, action) {
            state.f_ration_card = action.payload;
        },
        setResAadhar(state, action) {
            state.r_aadhar_card = action.payload;
        },
        setResRation(state, action) {
            state.r_ration_card = action.payload;
        },
        setGovtID(state, action) {
            state.govt_id = action.payload;
        },
        resetAll() {
            return initialState;
        },
        resetFamilyReqData(state) {
            Object.keys(familyReqState).forEach(f => {
                state[f] = familyReqState[f];
            });
            clearFamAadharCard();
            clearFamRationCard();
            clearResAadharCard();
            clearResRationCard();
            clearGovtID();
        },
        clearFamilyReqImages(state) {
            state.f_aadhar_card = [];
            state.f_ration_card = [];
            state.r_aadhar_card = [];
            state.r_ration_card = [];
            state.govt_id = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Bank Passbook
            .addCase(loadFamAadharFromStorage.fulfilled, (state, action) => {
                state.f_aadhar_card = action.payload;
            })
            .addCase(saveFamAadharToStorage.fulfilled, (state, action) => {
                state.f_aadhar_card = action.payload;
            })
            // Aadhar Attach
            .addCase(loadFamRationFromStorage.fulfilled, (state, action) => {
                state.f_ration_card = action.payload;
            })
            .addCase(saveFamRationToStorage.fulfilled, (state, action) => {
                state.f_ration_card = action.payload;
            })
            // UDID Attach
            .addCase(loadResAadharFromStorage.fulfilled, (state, action) => {
                state.r_aadhar_card = action.payload;
            })
            .addCase(saveResAadharToStorage.fulfilled, (state, action) => {
                state.r_aadhar_card = action.payload;
            })
            // Form7 Attach
            .addCase(loadResRationFromStorage.fulfilled, (state, action) => {
                state.r_ration_card = action.payload;
            })
            .addCase(saveResRationToStorage.fulfilled, (state, action) => {
                state.r_ration_card = action.payload;
            })
            // Form7 Attach
            .addCase(loadGovtIDFromStorage.fulfilled, (state, action) => {
                state.govt_id = action.payload;
            })
            .addCase(saveGovtIDToStorage.fulfilled, (state, action) => {
                state.govt_id = action.payload;
            })
    },
});

// Export slice actions
export const {
    setFamilyReqField,
    setFamAadhar,
    setFamRation,
    setResAadhar,
    setResRation,
    setGovtID,
    resetAll,
    resetFamilyReqData,
    clearFamilyReqImages
} = familyReqSlice.actions;

// Export the reducer
export default familyReqSlice.reducer;
