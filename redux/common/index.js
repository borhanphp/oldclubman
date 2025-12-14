import axios from '@/helpers/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getCompany = createAsyncThunk( 'common/getCompany', async (id) => {
    const result = axios.get( `company/show/${id}` )
    .then((res) => {
        const resData = res.data.data;
        return resData;
    })
    .catch((err) => console.log(err))
    return result;
} )


export const commonSlice = createSlice( {
    name: 'common',
    initialState: {
        menuClickId: null,
        enableSubmenu: false,
        error: false,
        company: {},
        isLoading: false
    },
    reducers: {
        handleSubmenu: (state, action) => {
           state.enableSubmenu = action.payload;
        },
        handleMenuId: (state, action) => {
            state.menuClickId = action.payload; 
            localStorage.setItem('menuId', action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        showPreloader: (state) => {
            state.isLoading = true;
        },
        hidePreloader: (state) => {
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getCompany.fulfilled, (state, action) => {
            state.company = action.payload;
            state.loading = false;
          }) 
      },
} );

export const { handleSubmenu, handleMenuId, setError, showPreloader, hidePreloader } = commonSlice.actions;

export default commonSlice.reducer;