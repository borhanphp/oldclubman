import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

export const getMyNfc = createAsyncThunk( 'nfc/getMyNfc', async ( ) => {
    const result = axios.get( "client/myNfc" )
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
} )



export const nfcSlice = createSlice({
  name: "nfc",
  initialState: {
    nfcData: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyNfc.fulfilled, (state, action) => {
        state.nfcData = action.payload;
        state.loading = false;
      })
      .addCase(getMyNfc.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyNfc.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export default nfcSlice.reducer;
