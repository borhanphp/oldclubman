import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";


export const initialPostData = {
  message: "",
  privacy_mode: "public",
  files: []
}


export const getGathering = createAsyncThunk( 'gathering/getGathering', async ( ) => {
    const result = axios.get( "client/gathering" )
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => {
        errorResponse(err);
    })
    return result;
} )

export const getPosts = createAsyncThunk( 'gathering/getPosts', async ( ) => {
  const result = axios.get( "post/10?page=1" )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const getPostById = createAsyncThunk( 'gathering/getPostById', async (id) => {
  const result = axios.get( `client/singlePost/${id}` )
  .then((res) => {
      console.log('get by id',res.data.data.value)
      const resData = res.data.data.value;
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

export const updatePost = createAsyncThunk( 'gathering/updatePost', async ( data) => {
  const result = axios.post( `/post/update/${data?.id}`, data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const storeComments = createAsyncThunk( 'gathering/storeComments', async ( data) => {
  const result = axios.post( "comment/store", data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const storeCommentReactions = createAsyncThunk( 'gathering/storeCommentReactions', async ( data) => {
  const result = axios.post( "comment/reaction_save", data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const storePostReactions = createAsyncThunk( 'gathering/storePostReactions', async ( data) => {
  const result = axios.post( "/post/reaction", data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const updatePostPrivacy = createAsyncThunk( 'gathering/updatePostPrivacy', async ( data) => {
  const result = axios.post( `/post/privacy/${data.id}`, data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const deletePost = createAsyncThunk( 'gathering/deletePost', async ( id) => {
  const result = axios.post( `/post/delete/${id}` )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async ({ commentId }) => {
    const response = await axios.post(`/comments/${commentId}/like`);
    return response.data;
  }
);

export const replyToComment = createAsyncThunk(
  "comments/replyToComment",
  async ({ commentId, content }) => {
    const response = await axios.post(`/comments/${commentId}/reply`, { content });
    return response.data;
  }
);




export const gatheringSlice = createSlice({
  name: "gathering",
  initialState: {
    gatheringData: {},
    singlePostData: {},
    postsData:[],
    loading: false,
    basicPostData: initialPostData,
    isPostModalOpen: false
  },
  reducers: {
    bindPostData: (state, action) => {
      state.basicPostData = action.payload || initialPostData
    },

    setPostModalOpen: (state, action) => {
        state.isPostModalOpen = action.payload
    }
  },
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
      .addCase(getPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.postsData = action.payload;
        state.loading = false;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.basicPostData = action.payload;
        state.loading = false;
      })

      .addCase(storePost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(storePost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(storePost.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(updatePost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export const {bindPostData, setPostModalOpen} = gatheringSlice.actions;
export default gatheringSlice.reducer;
