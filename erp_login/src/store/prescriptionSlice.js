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
    rows: [
        {
            medicine: '',
            medicine_type: '',
            duration: '',
            intake: '',
            med_instruction: '',
            morning: '',
            afternoon: '',
            night: '',
        },
    ],
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
    initialState: { ...baseState, ...prescriptionState },
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

        // 👇 rows actions
        addRow(state) {
            state.rows.push({
                medicine: '',
                medicine_type: '',
                duration: '',
                intake: '',
                med_instruction: '',
                morning: '',
                afternoon: '',
                night: '',
            });
        },
        removeRow(state, { payload }) {
            state.rows.splice(payload, 1);
        },
        updateRow(state, { payload: { index, field, value } }) {
            state.rows[index][field] = value;
        },
    },
});

export const {
    setPrescriptionField,
    resetAll,
    resetPrescription,
    addRow,
    removeRow,
    updateRow,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
