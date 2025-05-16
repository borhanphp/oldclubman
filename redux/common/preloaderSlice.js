import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
};

export const preloaderSlice = createSlice({
  name: 'preloader',
  initialState,
  reducers: {
    showPreloader: (state) => {
      state.isLoading = true;
    },
    hidePreloader: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showPreloader, hidePreloader } = preloaderSlice.actions;

export default preloaderSlice.reducer; 