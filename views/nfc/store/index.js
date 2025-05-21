import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";

export const initialNfcData = {
  prefix: '', 
  card_type: 1,
  first_name: '', 
  middle_name: '', 
  design_card_id: 1,
  display_nfc_color: "#ff00f",
  last_name: '', 
  suffix: '',
  accreditations: '', 
  preferredName: '', 
  middle_name: '', 
  pronoun: '',
  title: '', 
  department: '', 
  company: '', 
  headline: '',
  profile: "",
  logo: null,
  profilePhotoUrl: "",
  logoUrl: ""
}

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

export const getNfcById = createAsyncThunk('nfc/getNfcById', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`nfc/card/${id}`);
const data = res.data.data.nfc_card;
    const allData = {
      ...data,
      nfc_fields: data?.nfc_fields?.map((item) => ({
        ...item,
        nfc_id: item.id,
        display_name: item.pivot.display_text,
        nfc_user_name: item.pivot.field_value,
        nfc_label: item.pivot.label,
        label: item.pivot.label,
        uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      }))
    };
    const displayData = allData?.card_design;
    const infoData = allData?.nfc_info;
    // Merge as you did
    const resData = { 
      ...displayData, 
      ...infoData,  
      ...allData, 
      profilePhotoUrl: process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + infoData?.image,
      logoUrl: process.env.NEXT_PUBLIC_CARD_FILE_PATH + displayData?.logo,
      display_nfc_color: displayData?.color,

    };
    console.log('merged resData',resData)
    return resData;
  } catch (err) {
    errorResponse(err);
    // Pass error to rejected action
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const getNfcField = createAsyncThunk( 'nfc/getNfcField', async () => {
  const result = axios.get( `nfc/field` )
  .then((res) => {
    console.log('nfc field response', res.data.data)
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const storeNfc = createAsyncThunk( 'nfc/storeNfc', async (data) => {
  const result = axios.post( `/nfc/card/store`, data )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const updateNfc = createAsyncThunk( 'nfc/updateNfc', async (data) => {
  const result = axios.post( `/nfc/card/update/${data.id}`, data?.formData )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const duplicateNfc = createAsyncThunk( 'nfc/duplicateNfc', async (id) => {
  const result = axios.post( `/nfc/card/duplicate/${id}` )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const deleteNfc = createAsyncThunk( 'nfc/deleteNfc', async (id) => {
  const result = axios.post( `/nfc/card/delete/${id}` )
  .then((res) => {
      const resData = res.data.data;
      return resData;
  })
  .catch((err) => {
      errorResponse(err);
  })
  return result;
} )

export const getVertualBackground = createAsyncThunk( 'nfc/getVertualBackground', async () => {
  const result = axios.get( `/nfc/virtual_background` )
  .then((res) => {
    console.log('nfc virtual_background', res.data.data)
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
    basicNfcData: initialNfcData,
    fields: [],
    nfcFieldsResponse: []
  },
  reducers: {
    bindNfcData: (state, action) => {
      state.basicNfcData = action.payload || initialNfcData
    },
    addField: (state, action) => {
      state.fields.push(action.payload);
    },
    removeField: (state, action) => {
      state.fields = state.fields.filter(f => f.uid !== action.payload);
    },
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    reorderFields: (state, action) => {
      state.fields = action.payload;
    },
    updateField: (state, action) => {
      const { uid, key, value } = action.payload;
      const field = state.fields.find(f => f.uid === uid);
      if (field) {
        field[key] = value;
      }
    }
  },
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
      .addCase(getNfcById.fulfilled, (state, action) => {
        state.basicNfcData = action.payload;
        state.fields = action.payload.nfc_fields;
      })
      .addCase(getNfcField.fulfilled, (state, action) => {
        state.nfcFieldsResponse = action.payload;
      })
  },
});

export const {bindNfcData, addField, removeField, setFields, reorderFields, updateField} = nfcSlice.actions;


export default nfcSlice.reducer;
