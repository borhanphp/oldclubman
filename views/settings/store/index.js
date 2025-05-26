import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

const initialProfileSettingsData = {
  cover_photo: "",
  image: "",
  profile_overview: "",
  tagline: ""
}

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

export const getUserProfile = createAsyncThunk( 'settings/getUserProfile', async (id, limit = 10) => {
  const result = axios.get( `client/user_profile/${id}/10` )
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
      const resData = res.data.data.followers;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const followTo = createAsyncThunk( 'settings/followTo', async ( id) => {
  const result = axios.post( "/follow", id )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const unFollowTo = createAsyncThunk( 'settings/unFollowTo', async ( id) => {
  const result = axios.post( "/unfollow", id )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const saveContact = createAsyncThunk( 'settings/saveContact', async ( id) => {
  const result = axios.post( `/nfc/card/save_contact/${id}`)
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const getUserFollowers = createAsyncThunk( 'settings/getUserFollowers', async (id, limit=20 ) => {
  const result = axios.get( `/client/all_followers_user/${id}/20` )
  .then((res) => {
    console.log(res.data.data.followers)
      const resData = res.data.data.followers;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const getUserFollowing = createAsyncThunk( 'settings/getUserFollowing', async (id, limit=20 ) => {
  const result = axios.get( `/client/all_following_user/${id}/20` )
  .then((res) => {
    console.log(res.data.data.followers)

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
    profileSettingData: initialProfileSettingsData,
    personalPosts: [],
    loading: false,
    followLoading: false,
    myFollowers: [],
    profile:{},
    totalFollowers: 0,
    userProfileData: {},
    userFollowers: [],
    userFollowing: []
  },
  reducers: {
    bindProfileData: (state, action) => {
      state.profileData = action.payload || {}
    },
    bindProfileSettingData: (state, action) => {
      state.profileSettingData = action.payload || initialProfileSettingsData
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.profileData = action.payload.client;
        state.profileSettingData = action.payload.client;
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
      .addCase(storeBsicInformation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(storeBsicInformation.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfileData = action.payload;
      })
      .addCase(unFollowTo.fulfilled, (state, action) => {
        state.followLoading = false;
      })
      .addCase(unFollowTo.pending, (state, action) => {
        state.followLoading = true;
      })
      .addCase(unFollowTo.rejected, (state, action) => {
        state.followLoading = false;
      })
      .addCase(followTo.fulfilled, (state, action) => {
        state.followLoading = false;
      })
      .addCase(followTo.pending, (state, action) => {
        state.followLoading = true;
      })
      .addCase(followTo.rejected, (state, action) => {
        state.followLoading = false;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.userFollowers = action.payload;
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.userFollowing = action.payload;
      })
  },
});

export const {bindProfileData, bindProfileSettingData} = settingsSlice.actions;

export default settingsSlice.reducer;
