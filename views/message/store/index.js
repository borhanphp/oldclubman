import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

export const getAllChat = createAsyncThunk('chat/getAllChat', async () => {
    const result = axios.get("chat")
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
})

export const startConversation = createAsyncThunk('chat/startConversation', async (data) => {
  const result = axios.post(`chat`, data)
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
})

export const allConversation = createAsyncThunk('chat/allConversation', async (data) => {
  const result = axios.get(`chat`)
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
})

export const sendMessage = createAsyncThunk('chat/sendMessage', async (data) => {
  try {
    let formData = new FormData();
    
    // Add message content
    formData.append('content', data.content || '');
    
    // Add file if exists
    if (data.file) {
      formData.append('files[]', data.file);
    }

    // Add message type
    formData.append('type', data.type || 'text');

    const result = await axios.post(`chat/${data.chatId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });

    if (result.data.success === false) {
      throw new Error(result.data.message || 'Failed to send message');
    }

    return result.data.data;
  } catch (err) {
    errorResponse(err);
    throw err;
  }
});

export const getMessage = createAsyncThunk('chat/getMessage', async (data) => {
  try {
    console.log("checking for getting messages work or not");
    const result = await axios.get(`chat/${data?.id}/messages`);
    return {
      messages: result.data.data,
      conversation: {
        id: data.id,
        ...result.data.conversation // Include any additional conversation data from the response
      }
    };
  } catch (err) {
    errorResponse(err);
    throw err;
  }
});

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    allChat: [],
    prevChat: [],
    loading: false,
    convarsationData: null,
    error: null
  },
  reducers: {
    setCurrentConversation: (state, action) => {
      state.convarsationData = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChat.fulfilled, (state, action) => {
        state.allChat = action.payload;
        state.loading = false;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.prevChat = action.payload.messages;
        state.convarsationData = action.payload.conversation;
        state.loading = false;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.convarsationData = action.payload.conversation;
        if (action.payload.conversation) {
          state.allChat = [...state.allChat, action.payload.conversation];
        }
        state.loading = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.prevChat && action.payload?.message) {
          state.prevChat.push(action.payload.message);
        }
      })
      .addCase(getAllChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(startConversation.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default chatSlice.reducer;
