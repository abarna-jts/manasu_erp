import { createSlice } from '@reduxjs/toolkit';

const handOverState = {
    admission_no: '',
    rescue_name: '',
    age: '',
    medicine_provided: '',
    toiletries_provided: '',
    dress_provided: '',
    travel_expenses: '',
    welfare_expenses: '',
    medical_prescription: '',
    discharge_summary: '',
    travel_letter: ''
};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...handOverState
};

const handOverSlice = createSlice({
    name: 'handOver',
    initialState,
    reducers: {
        setHandOverField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetHandOver(state) {
            Object.keys(handOverState).forEach(f => {
                state[f] = handOverState[f];
            });
        },

    },
});

export const {
    setHandOverField,
    resetAll,
    resetHandOver
} = handOverSlice.actions;

export default handOverSlice.reducer;
