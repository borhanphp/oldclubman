import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    results: [],
    loading: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },
    removeQuery: (state, action) => {
      state.query = "";
    },
  },
});

export const { setSearchQuery, setSearchResults, setSearchLoading, removeQuery } = searchSlice.actions;
export default searchSlice.reducer;