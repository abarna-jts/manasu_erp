import { createSlice } from '@reduxjs/toolkit';

const prescriptionState = {
    admission_no: '',
    rescue_name: '',
    age: '',
    op_no: '',
    hospital_name: '',
    department: '',
    diagnosis: '',
    masterHealthCheckup: '',
    medical_type: '',
    instruction: '',
    advice: '',
    follow_up: '',

};

const baseState = {
    admission_no: '',
    date: '',
};

const initialState = {
    ...baseState,
    ...prescriptionState
};

const prescriptionSlice = createSlice({
    name: 'prescription',
    initialState,
    reducers: {
        setPrescriptionField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        resetAll() {
            return initialState;
        },
        resetPrescription(state) {
            Object.keys(prescriptionState).forEach((f) => {
                state[f] = prescriptionState[f];
            });
        },
    },
});

export const {
    setPrescriptionField,
    resetAll,
    resetPrescription
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
