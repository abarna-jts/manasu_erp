import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    saveHandwritten_document, saveSignature, saveSelfphoto,
    loadHandwritten_document, loadSignature, loadSelfphoto,
    clearHandwritten_document, clearSignature, clearSelfphoto,
} from "./photoStorage";

const selfDeclarationState = {
    rescue_name: '',
    age: '',
    description: '',
};

// Base state
const baseState = {
    admission_no: '',
    rescue_name: '',
    age:'',
};

// Combined initial state including file attachments
const initialState = {
    ...baseState,
    ...selfDeclarationState,
    handwritten_document: [],
    signature: [],
    photo: []
};

// Async thunk to load hand written document files
export const loadHandWrittenDocFromStorage = createAsyncThunk(
    "self_declaration/loadHandwritten_document",
    async () => {
        const files = await loadHandwritten_document();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save hand written document files
export const saveHandWrittenDocToStorage = createAsyncThunk(
    "self_declaration/saveHandwritten_document",
    async (files) => {
        await saveHandwritten_document(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Signature document files
export const loadSignatureFromStorage = createAsyncThunk(
    "self_declaration/loadSignature",
    async () => {
        const files = await loadSignature();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Signature files
export const saveSignatureToStorage = createAsyncThunk(
    "self_declaration/saveSignature",
    async (files) => {
        await saveSignature(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to load Photo files
export const loadSelfPhotoFromStorage = createAsyncThunk(
    "self_declaration/loadSelfphoto",
    async () => {
        const files = await loadSelfphoto();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Async thunk to save Photo files
export const saveSelfPhotoFromStorage = createAsyncThunk(
    "self_declaration/saveSelfphoto",
    async (files) => {
        await saveSelfphoto(files);
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file),
        }));
    }
);

// Create the slice
const selfDeclarationSlice = createSlice({
    name: 'self_declaration',
    initialState,
    reducers: {
        setselfDeclarationField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setHandWrittenDoc(state, action) {
            state.handwritten_document = action.payload;
        },
        setSignature(state, action) {
            state.signature = action.payload;
        },
        setSelfPhoto(state, action) {
            state.photo = action.payload;
        },
        
        resetAll() {
            return initialState;
        },
        resetSelfDeclarationData(state) {
            Object.keys(selfDeclarationState).forEach(f => {
                state[f] = selfDeclarationState[f];
            });
            clearHandwritten_document();
            clearSignature();
            clearSelfphoto();
        },
        clearSelfDeclationImages(state) {
            state.handwritten_document = [];
            state.signature = [];
            state.photo = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Bank Passbook
            .addCase(loadHandWrittenDocFromStorage.fulfilled, (state, action) => {
                state.handwritten_document = action.payload;
            })
            .addCase(saveHandWrittenDocToStorage.fulfilled, (state, action) => {
                state.handwritten_document = action.payload;
            })
            // Aadhar Attach
            .addCase(loadSignatureFromStorage.fulfilled, (state, action) => {
                state.signature = action.payload;
            })
            .addCase(saveSignatureToStorage.fulfilled, (state, action) => {
                state.signature = action.payload;
            })
            // UDID Attach
            .addCase(loadSelfPhotoFromStorage.fulfilled, (state, action) => {
                state.photo = action.payload;
            })
            .addCase(saveSelfPhotoFromStorage.fulfilled, (state, action) => {
                state.photo = action.payload;
            })
            
    },
});

// Export slice actions
export const {
    setselfDeclarationField,
    setHandWrittenDoc,
    setSignature,
    setSelfPhoto,
    resetAll,
    resetSelfDeclarationData,
    clearSelfDeclationImages
} = selfDeclarationSlice.actions;

// Export the reducer
export default selfDeclarationSlice.reducer;
