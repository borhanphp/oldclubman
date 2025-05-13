import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

export const getAllChat = createAsyncThunk( 'chat/getAllChat', async ( ) => {
    const result = axios.get( "chat" )
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
} )


export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    allChat: [],
    loading: false
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChat.fulfilled, (state, action) => {
        state.allChat = action.payload;
        state.loading = false;
      })
  },
});

export const {} = chatSlice.actions;


export default chatSlice.reducer;
