import { createSlice } from '@reduxjs/toolkit';

const savedPhoto = localStorage.getItem("recovery_photo");

const observationState = {
    follow_up: "",
    date: "",
    recovery_photo: savedPhoto ? JSON.parse(savedPhoto) : "",  // load on refresh
}

const baseState = {
    admission_no: '',
    resident_name: '',
};

const initialState = {
    ...baseState,
    ...observationState
}


const observationSlice = createSlice({
    name: 'observation',
    initialState,
    reducers: {
        setObservationField(state, { payload: { field, value } }) {
            state[field] = value;
        },
        setRecoveryPhoto(state, action) {
            state.recovery_photo = action.payload;
            // save to localStorage so it survives refresh
            localStorage.setItem("recovery_photo", JSON.stringify(action.payload));
        },
        resetAll() {
            return initialState;
        },
        resetObservationData(state) {
            Object.keys(observationState).forEach(f => {
                state[f] = observationState[f];
            });
        },

    },
});


export const {
    setObservationField,
    resetAll,
    resetObservationData,
    setRecoveryPhoto,
} = observationSlice.actions;

export default observationSlice.reducer;