import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";
import { showPreloader, hidePreloader } from "@/redux/common";


export const initialPostData = {
  message: "",
  privacy_mode: "public",
  files: []
}


export const getGathering = createAsyncThunk( 'gathering/getGathering', async (_, { dispatch }) => {
    dispatch(showPreloader());
    const result = axios.get( "client/gathering" )
    .then((res) => {
        const resData = res.data.data;
        dispatch(hidePreloader());
        return resData;
    })
    .catch((err) => {
        dispatch(hidePreloader());
        errorResponse(err);
    })
    return result;
} )

export const getPosts = createAsyncThunk( 'gathering/getPosts', async (page = 1, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.get( `post/10?page=${page}` )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const getPostById = createAsyncThunk( 'gathering/getPostById', async (id, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.get( `client/singlePost/${id}` )
  .then((res) => {
      console.log('get by id',res.data.data.value)
      const resData = res.data.data.value;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const storePost = createAsyncThunk( 'gathering/storePost', async (data, { dispatch }) => {
    dispatch(showPreloader());
    const result = axios.post( "post/store", data )
    .then((res) => {
        const resData = res.data.data;
        dispatch(hidePreloader());
        return resData;
    })
    .catch((err) => {
        dispatch(hidePreloader());
        errorResponse(err);
    })
    return result;
} )

export const updatePost = createAsyncThunk( 'gathering/updatePost', async (data, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.post( `/post/update/${data?.id}`, data )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const storeComments = createAsyncThunk( 'gathering/storeComments', async (data, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.post( "comment/store", data )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const storeCommentReactions = createAsyncThunk( 'gathering/storeCommentReactions', async (data, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.post( "comment/reaction_save", data )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const storePostReactions = createAsyncThunk( 'gathering/storePostReactions', async (data, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.post( "/post/reaction", data )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const updatePostPrivacy = createAsyncThunk( 'gathering/updatePostPrivacy', async (data, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.post( `/post/privacy/${data.id}`, data )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const deletePost = createAsyncThunk( 'gathering/deletePost', async (id, { dispatch }) => {
  dispatch(showPreloader());
  const result = axios.post( `/post/delete/${id}` )
  .then((res) => {
      const resData = res.data.data;
      dispatch(hidePreloader());
      return resData;
  })
  .catch((err) => {
      dispatch(hidePreloader());
      errorResponse(err);
  })
  return result;
} )

export const likeComment = createAsyncThunk(
  "gathering/likeComment",
  async (data, { dispatch }) => {
    dispatch(showPreloader());
    try {
      const response = await axios.post(`comment/reaction_save`, data);
      dispatch(hidePreloader());
      return response.data;
    } catch (err) {
      dispatch(hidePreloader());
      errorResponse(err);
      throw err;
    }
  }
);

export const likeReply = createAsyncThunk(
  "gathering/likeComment",
  async (data, { dispatch }) => {
    dispatch(showPreloader());
    try {
      const response = await axios.post(`/comment/replay/reaction`, data);
      dispatch(hidePreloader());
      return response.data;
    } catch (err) {
      dispatch(hidePreloader());
      errorResponse(err);
      throw err;
    }
  }
);

export const replyToComment = createAsyncThunk(
  "gathering/replyToComment",
  async (data, { dispatch }) => {
    dispatch(showPreloader());
    try {
      const response = await axios.post(`/comment/replay`, data);
      dispatch(hidePreloader());
      return response.data;
    } catch (err) {
      dispatch(hidePreloader());
      errorResponse(err);
      throw err;
    }
  }
);



export const getCommentReplies = createAsyncThunk( 
  'gathering/getCommentReplies', 
  async (commentId, { dispatch }) => {
    dispatch(showPreloader());
    try {
      const response = await axios.get(`comment/reply?comment_id=${commentId}`);
      console.log('comment reply',response)
      dispatch(hidePreloader());
      return response.data;
    } catch (err) {
      dispatch(hidePreloader());
      errorResponse(err);
      throw err;
    }
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
