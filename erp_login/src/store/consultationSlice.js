import { createSlice } from '@reduxjs/toolkit';

const consultationState = {
    admission_no: '',
    resident_name: '',
    date: '',
    follow_up: '',
};

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
        resetAll() {
            return initialState;
        },
        resetConsultation(state) {
            Object.keys(consultationState).forEach(f => {
                state[f] = consultationState[f];
            });
        },

    },
});

export const {
    setConsultationField,
    resetAll,
    resetConsultation
} = consultationSlice.actions;

export default consultationSlice.reducer;
