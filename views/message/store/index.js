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

export const startConversation = createAsyncThunk( 'chat/startConversation', async ( data) => {
  const result = axios.post( `chat`, data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const allConversation = createAsyncThunk( 'chat/allConversation', async ( data) => {
  const result = axios.get( `chat` )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const sendMessage = createAsyncThunk( 'chat/sendMessage', async ( data) => {
  const result = axios.post( `/chat/${data?.chatId}/messages`, data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const getMessage = createAsyncThunk( 'chat/getMessage', async (data) => {
  const result = axios.get( `/chat/${data?.id}/messages` )
  .then((res) => {
    // console.log('res from get message',res)
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
    prevChat: [],
    loading: false,
    convarsationData: []
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChat.fulfilled, (state, action) => {
        state.allChat = action.payload;
        state.loading = false;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.prevChat = action.payload;
        state.loading = false;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.convarsationData = action.payload.conversation;
        state.loading = false;
      })
  },
});

export const {} = chatSlice.actions;


export default chatSlice.reducer;
