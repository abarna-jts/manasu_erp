import { createSlice } from '@reduxjs/toolkit';

const dischargeSummaryState = {
    admission_no: '',
    rescue_name: '',
    referred_by: '',
    escape: '',
    death: '',
    discharge: '',
    transfer: '',
    reunited: '',
    state_venue: '',
    state: ''
};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...dischargeSummaryState
};

const dischargeSummarySliceSlice = createSlice({
    name: 'discharge_summary',
    initialState,
    reducers: {
        setDischargeSummaryField(state, action) {
            const { field, value } = action.payload;
            state[field] = value;

            // Handle dependent logic inside reducer
            if (field === 'transfer' && value === 'No') {
                state.state_venue = '';
            }
            if (field === 'reunited' && value === 'No') {
                state.state = '';
            }
        },
        resetAll() {
            return initialState;
        },
        resetDischargeSummary(state) {
            Object.keys(dischargeSummaryState).forEach(f => {
                state[f] = dischargeSummaryState[f];
            });
        },

    },
});

export const {
    setDischargeSummaryField,
    resetAll,
    resetDischargeSummary
} = dischargeSummarySliceSlice.actions;

export default dischargeSummarySliceSlice.reducer;
