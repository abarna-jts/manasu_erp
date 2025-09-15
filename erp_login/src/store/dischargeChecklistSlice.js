// essentialSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FILE_TYPES } from './fileTypes';
import { saveFiles, loadFiles, clearFiles } from './fileStorage';

// Dynamically create initial state
const dischargeChecklistState = {
    admission_no: '',
    familyRequestLetter: '',
    selfDeclarationLetter: '',
    mediaConsentLetter: '',
    familyRequestLetterFile: null,
    selfDeclarationFile: null,
    mediaConsentFile: null,
    residentIDproof: '',
    residentIDproofFile: null,
    familyIDproof: '',
    familyIDproofFile: null,
    aadharCard: '',
    aadharCardFile: null,
    udidCard: '',
    udidCardFile: null,
    disabilityCertificate: '',
    disabilityCertificateFile: null,
    bankPassbook: '',
    bankPassbookFile: null,
    healthInsurance: '',
    healthInsuranceFile: null,
    medicalReport: '',
    medicalReportFile: null,
    dischargeSummary: '',
    dischargeSummaryFile: null,
    medications: '',
    medicationsFile: null,
    Clothes: '',
    ClothesFile: null,
    possessionsRecovered: '',
    possessionsRecoveredFile: null,
    dischargeAllowance: '',
    dischargeAllowanceFile: null,
    travelExpenses: '',
    travelExpensesFile: null,
    copyOfdischargeSummary: '',
    copyOfdischargeSummaryFile: null,
    travelSafetyLetter: '',
    travelSafetyLetterFile: null,
    reunionPhoto: '',
    reunionPhotoFile: null,
    witnessSignature: '',
    witnessSignatureFile: null,
    any_other: '',
}
const initialState = {
    ...dischargeChecklistState,
    admission_no: ''
};

FILE_TYPES.forEach(type => {
    initialState[type] = [];
});

// Async thunks
export const loadFilesFromStorage = createAsyncThunk(
    'discharge_checklist/loadFiles',
    async (type) => {
        const files = await loadFiles(type);
        return { type, files };
    }
);

export const saveFilesToStorage = createAsyncThunk(
    'discharge_checklist/saveFiles',
    async ({ type, files }) => {
        await saveFiles(type, files);
        return { type, files };
    }
);

export const clearFilesFromStorage = createAsyncThunk(
    'discharge_checklist/clearFiles',
    async (type) => {
        await clearFiles(type);
        return type;
    }
);

// Slice definition
const dischargeChecklistSlice = createSlice({
    name: 'discharge_checklist',
    initialState,
    reducers: {
        setField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadFilesFromStorage.fulfilled, (state, action) => {
                const { type, files } = action.payload;
                state[type] = files;
            })
            .addCase(saveFilesToStorage.fulfilled, (state, action) => {
                const { type, files } = action.payload;
                state[type] = files;
            })
            .addCase(clearFilesFromStorage.fulfilled, (state, action) => {
                const type = action.payload;
                state[type] = [];
            });
    }
});

export const { setField, resetAll } = dischargeChecklistSlice.actions;
export default dischargeChecklistSlice.reducer;
