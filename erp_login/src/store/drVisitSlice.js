import { createSlice } from '@reduxjs/toolkit';

const drVisitState = {
    dr_name: '',
    hospital_name: '',
    date_time: '',
    resident_examinite: '',
    report: ''
};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...drVisitState
};

const drVisitSlice = createSlice({
    name: 'dr_visit',
    initialState,
    reducers: {
        setDrVisitField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetDrVisit(state) {
            Object.keys(drVisitState).forEach(f => {
                state[f] = drVisitState[f];
            });
        },

    },
});

export const {
    setDrVisitField,
    resetAll,
    resetDrVisit
} = drVisitSlice.actions;

export default drVisitSlice.reducer;
