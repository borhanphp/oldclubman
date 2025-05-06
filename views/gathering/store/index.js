import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

export const getGathering = createAsyncThunk( 'gathering/getGathering', async ( ) => {
    const result = axios.get( "client/gathering" )
    .then((res) => {
        console.log('sdf',res)
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
} )

export const storePost = createAsyncThunk( 'gathering/storePost', async ( data) => {
    const result = axios.post( "post/store", data )
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
} )



export const gatheringSlice = createSlice({
  name: "gathering",
  initialState: {
    gatheringData: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGathering.fulfilled, (state, action) => {
        state.gatheringData = action.payload;
        state.loading = false;
      })
      .addCase(getGathering.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getGathering.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export default gatheringSlice.reducer;
