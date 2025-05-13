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

export const storeBsicInformation = createAsyncThunk( 'settings/storeBsicInformation', async ( data) => {
  const result = axios.post( "/client/save_profile", data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const storeProfileSetting = createAsyncThunk( 'settings/storeBsicInformation', async ( data) => {
  const result = axios.post( "/client/save_cover_profile_photo", data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const getAllFollowers = createAsyncThunk( 'settings/getAllFollowers', async ( ) => {
  const result = axios.get( "client/all_followers" )
  .then((res) => {
    console.log('followeres',res)
      const resData = res.data.data.followers;
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
    personalPosts: [],
    loading: false,
    myFollowers: [],
    profile:{},
    totalFollowers: 0
  },
  reducers: {
    bindProfileData: (state, action) => {
      state.profileData = action.payload || {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.profileData = action.payload.client;
        state.profile = action.payload;
        state.personalPosts = action.payload.post;
        state.loading = false;
      })
      .addCase(getMyProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getAllFollowers.fulfilled, (state, action) => {
        state.myFollowers = action.payload;
        state.loading = false;
        state.totalFollowers = action.payload.length;
      })
  },
});

export const {bindProfileData} = settingsSlice.actions;

export default settingsSlice.reducer;
