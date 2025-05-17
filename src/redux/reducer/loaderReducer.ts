import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: false,
};

export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    loaderTrue: (state) => {
      state.status = true;
    },
    loaderFalse: (state) => {
      state.status = false;
    }
  }
});

export const {
  loaderTrue,
  loaderFalse
} = loaderSlice.actions;

export default loaderSlice.reducer;
