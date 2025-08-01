// src/store/admissionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  referred_by: '',
  from_place: '',
  date_time: '',
  police_memo: '',
  rescue_name: '',
  age: '',
  rescue_status: '',
};

const admissionSlice = createSlice({
  name: 'admission',
  initialState,
  reducers: {
    setField(state, { payload: { field, value } }) {
      state[field] = value;
    },
    resetAll() {
      return initialState;
    },
  },
});

export const { setField, resetAll } = admissionSlice.actions;
export default admissionSlice.reducer;
