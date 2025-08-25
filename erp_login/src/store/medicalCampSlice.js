import { createSlice } from '@reduxjs/toolkit';

const medicalCampState = {
    camp_name: '',
    hospital_name: '',
    date: '',
    camp_type: '',
    organised_by: '',
    participants: '',
    feedback: '',
    general_details: ''
};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...medicalCampState
};

const medicalCampSlice = createSlice({
    name: 'medical_camp',
    initialState,
    reducers: {
        setMedicalCampField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetMedicalCamp(state) {
            Object.keys(medicalCampState).forEach(f => {
                state[f] = medicalCampState[f];
            });
        },

    },
});

export const {
    setMedicalCampField,
    resetAll,
    resetMedicalCamp
} = medicalCampSlice.actions;

export default medicalCampSlice.reducer;
