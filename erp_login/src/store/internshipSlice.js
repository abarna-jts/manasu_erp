import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    saveStudPhotos,
    loadStudPhotos,
    clearStudPhotos,
} from "./photoStorage";

const internshipState = {
    stud_name: '',
    stud_id: '',
    department: '',
    email: '',
    phone: '',
    secondary_phone: '',
    field: '',
    clg_name: '',
    duration: '',
    from_date: '',
    to_date: '',
    supervisor_name: '',
    supervisor_email: '',
    supervisor_phone: '',
    choose_intern: '',
};

export const loadStudPhotosFromStorage = createAsyncThunk(
    "internship/loadStudPhotos",
    async () => {
        const files = await loadStudPhotos();
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file), // preview only
        }));
    }
);

export const saveStudPhotosToStorage = createAsyncThunk(
    "internship/saveStudPhotos",
    async (files) => {
        await saveStudPhotos(files); // still save real File objects in IndexedDB
        return files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            preview: URL.createObjectURL(file), // only store metadata + preview
        }));
    }
);

const initialState = {
    ...internshipState
};

const internshipSlice = createSlice({
    name: 'internship',
    initialState,
    reducers: {
        setIntershipField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setStudPhotos(state, action) {
            state.stud_photo = action.payload;

        },
        resetAll() {
            return initialState;
        },
        resetInternship(state) {
            Object.keys(internshipState).forEach(f => {
                state[f] = internshipState[f];
            });
            clearStudPhotos();
        },
        clearInternshipPhotos: (state) => {
            state.stud_photo = [];
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadStudPhotosFromStorage.fulfilled, (state, action) => {
                state.stud_photo = action.payload;
            })
            .addCase(saveStudPhotosToStorage.fulfilled, (state, action) => {
                state.stud_photo = action.payload;
            });
    },
});

export const {
    setIntershipField,
    setStudPhotos,
    resetAll,
    resetInternship,
    clearInternshipPhotos
} = internshipSlice.actions;

export default internshipSlice.reducer;
