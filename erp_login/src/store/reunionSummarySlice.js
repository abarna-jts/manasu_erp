import { createSlice } from '@reduxjs/toolkit';

const reunionState = {
    rescue_name: '',
    date: '',
    report: '',
};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...reunionState
};

const reunionSummarySlice = createSlice({
    name: 'reunion',
    initialState,
    reducers: {
        setReunionField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetReunionSummary(state) {
            Object.keys(reunionState).forEach(f => {
                state[f] = reunionState[f];
            });
        },

    },
});

export const {
    setReunionField,
    resetAll,
    resetReunionSummary
} = reunionSummarySlice.actions;

export default reunionSummarySlice.reducer;
