import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

export const getMyProfile = createAsyncThunk( 'settings/getMyProfile', async ( ) => {
    const result = axios.get( "client/myprofile" )
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
} )



export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    profileData: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.loading = false;
      })
      .addCase(getMyProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export default settingsSlice.reducer;
