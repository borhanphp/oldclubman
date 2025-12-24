import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import errorResponse, { clearLocal, removeToken, setLocal, setToken } from "@/utility";
import axios from "@/helpers/axios";
import errorResponse, { setLocal } from "@/utility";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";

export const handleLoginFunc = createAsyncThunk(
  "login/handleLoginFunc",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/client/login', data);
      const resData = await response?.data?.data;
      const access_token = await resData?.access_token || "";
       setLocal('old_token', access_token);
          Cookies.set('old_token', access_token);
          window.location.assign("/");
     
      return resData;
    } catch (err) {
      if (err.response?.status === 500) {
        toast.error(err.response.statusText + ', ' + "Contact with authority");
      } else {
        toast.error(err.response?.data?.data?.error || "Login failed");
      }
      return rejectWithValue(err.response?.data);
    }
  }
);

// export const handleEmailSubmitForOtp = createAsyncThunk("login/handleEmailSubmitForOtp", async (data) => {
//   const result = axios
//     .post("reset-password-otp", data)
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       errorResponse(err);
//     });
//   return result;
// }
// );

export const handleResetPassword = createAsyncThunk("login/handleResetPassword", async (data) => {
  const result = axios
    .post("client/forget-password", data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      errorResponse(err);
    });
  return result;
}
);


// export const handleLogout = createAsyncThunk("login/handleLogout", async () => {
//   try {
//     const res = await axios.post("logout");

//     removeToken();
//     clearLocal();

//     document.cookie.split(";").forEach((cookie) => {
//       const name = cookie.split("=")[0].trim();
//       document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
//     });
//     window.location.assign("/");

//     return res;
//   } catch (err) {
//     if (err.response?.status === 500) {
//       toast.error(err.response.statusText + ", Contact with authority");
//     } else {
//       toast.error(err.response?.data?.data?.error || "Logout failed");
//     }
//     console.log("Error from async", err);
//     throw err;
//   }
// });


export const authSlice = createSlice({
  name: "login",
  initialState: {
    loading: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(handleLoginFunc.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(handleLoginFunc.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handleLoginFunc.rejected, (state, action) => {
        state.loading = false;
      })
      // .addCase(handleLogout.fulfilled, (state, action) => {
      //   state.loading = false;
      // })
      // .addCase(handleEmailSubmitForOtp.fulfilled, (state, action) => {
      //   state.loading = false;
      // })
      // .addCase(handleEmailSubmitForOtp.pending, (state, action) => {
      //   state.loading = true;
      // })
      // .addCase(handleEmailSubmitForOtp.rejected, (state, action) => {
      //   state.loading = false;
      // })
      .addCase(handleResetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(handleResetPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handleResetPassword.rejected, (state, action) => {
        state.loading = false;
      })
  },
});

export const { handleLogin } = authSlice.actions;

export default authSlice.reducer;
