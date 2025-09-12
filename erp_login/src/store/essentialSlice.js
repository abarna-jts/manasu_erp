import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    saveBankPassbook, saveAadharAttach, saveForm7Attachment, saveUdidAttach,
    loadBankPassbook, loadAadharAttach, loadForm7Attachment, loadUdidAttach,
    clearBankPassbook, clearAadharAttach, clearForm7Attachment, clearUdidAttach
} from "./photoStorage";

// Initial state for the essential form fields
const essentialState = {
    admission_no: '',
    rescue_name: '',
    aadhar_card: '',
    udid_no: '',
    disability_no: '',
    voter_id: '',
    form_7: '',
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    insurance_provider: '',
    policy_no: '',
    validity_period: '',
    other_gvt_scheme: '',
    any_other: ''
};

// Base state
const baseState = {
    admission_no: '',
    rescue_name: '',
};

// Combined initial state including file attachments
const initialState = {
    ...baseState,
    ...essentialState,
    bank_passbook: [],
    attach_aadhar: [],
    udid_attach: [],
    form7_attach: []
};


// Async thunk to load Bank Passbook files
export const loadBankPassbookFromStorage = createAsyncThunk(
    "essential/loadBankPassbook",
    async () => {
        const files = await loadBankPassbook();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Bank Passbook files
export const saveBankPassbookToStorage = createAsyncThunk(
    "essential/saveBankPassbook",
    async (files) => {
        await saveBankPassbook(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Aadhar Attach files
export const loadAadharAttachFromStorage = createAsyncThunk(
    "essential/loadAadharAttach",
    async () => {
        const files = await loadAadharAttach();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Aadhar Attach files
export const saveAadharAttachToStorage = createAsyncThunk(
    "essential/saveAadharAttach",
    async (files) => {
        await saveAadharAttach(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load UDID Attach files
export const loadUdidAttachFromStorage = createAsyncThunk(
    "essential/loadUdidAttach",
    async () => {
        const files = await loadUdidAttach();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save UDID Attach files
export const saveUdidAttachToStorage = createAsyncThunk(
    "essential/saveUdidAttach",
    async (files) => {
        await saveUdidAttach(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Form 7 Attach files
export const loadForm7AttachFromStorage = createAsyncThunk(
    "essential/loadForm7Attach",
    async () => {
        const files = await loadForm7Attachment();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Form 7 Attach files
export const saveForm7AttachToStorage = createAsyncThunk(
    "essential/saveForm7Attach",
    async (files) => {
        await saveForm7Attachment(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Create the slice
const essentialSlice = createSlice({
    name: 'essential',
    initialState,
    reducers: {
        setEssentialField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setBankPassbook(state, action) {
            state.bank_passbook = action.payload;
        },
        setAadharAttach(state, action) {
            state.attach_aadhar = action.payload;
        },
        setUdidAttach(state, action) {
            state.udid_attach = action.payload;
        },
        setForm7Attach(state, action) {
            state.form7_attach = action.payload;
        },
        resetAll() {
            return initialState;
        },
        resetEssentialData(state) {
            Object.keys(essentialState).forEach(f => {
                state[f] = essentialState[f];
            });
            clearBankPassbook();
            clearAadharAttach();
            clearForm7Attachment();
            clearUdidAttach();
        },
        clearEssentialImages(state) {
            state.bank_passbook = [];
            state.attach_aadhar = [];
            state.udid_attach = [];
            state.form7_attach = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Bank Passbook
            .addCase(loadBankPassbookFromStorage.fulfilled, (state, action) => {
                state.bank_passbook = action.payload;
            })
            .addCase(saveBankPassbookToStorage.fulfilled, (state, action) => {
                state.bank_passbook = action.payload;
            })
            // Aadhar Attach
            .addCase(loadAadharAttachFromStorage.fulfilled, (state, action) => {
                state.attach_aadhar = action.payload;
            })
            .addCase(saveAadharAttachToStorage.fulfilled, (state, action) => {
                state.attach_aadhar = action.payload;
            })
            // UDID Attach
            .addCase(loadUdidAttachFromStorage.fulfilled, (state, action) => {
                state.udid_attach = action.payload;
            })
            .addCase(saveUdidAttachToStorage.fulfilled, (state, action) => {
                state.udid_attach = action.payload;
            })
            // Form7 Attach
            .addCase(loadForm7AttachFromStorage.fulfilled, (state, action) => {
                state.form7_attach = action.payload;
            })
            .addCase(saveForm7AttachToStorage.fulfilled, (state, action) => {
                state.form7_attach = action.payload;
            });
    },
});

// Export slice actions
export const {
    setEssentialField,
    setBankPassbook,
    setAadharAttach,
    setUdidAttach,
    setForm7Attach,
    resetAll,
    resetEssentialData,
    clearEssentialImages
} = essentialSlice.actions;

// Export the reducer
export default essentialSlice.reducer;
