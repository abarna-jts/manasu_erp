import { createSlice } from '@reduxjs/toolkit';

const nurseRecordState = {
    admission_no: '',
    month: '',
    temperature: '',
    bp: '',
    pulse: '',
    weight: '',
    date: ''
};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...nurseRecordState
};

const nurseRecordSlice = createSlice({
    name: 'nurse_record',
    initialState,
    reducers: {
        setNurseRecordField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetNurseRecord(state) {
            Object.keys(nurseRecordState).forEach(f => {
                state[f] = nurseRecordState[f];
            });
        },

    },
});

export const {
    setNurseRecordField,
    resetAll,
    resetNurseRecord
} = nurseRecordSlice.actions;

export default nurseRecordSlice.reducer;
