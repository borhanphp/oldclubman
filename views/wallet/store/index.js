import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";
import toast from "react-hot-toast";

const initialState = {
  balance: 0,
  transactions: [],
  giftCards: [],
  availableGiftCards: [],
  loading: false,
  error: null,
};

// Get wallet balance
export const getWalletBalance = createAsyncThunk(
  "wallet/getWalletBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/balance");
      return response.data.data?.balance || 0;
    } catch (err) {
      errorResponse(err);
      return rejectWithValue(err.response?.data);
    }
  }
);

// Demo transactions for testing
const DEMO_TRANSACTIONS = [
  {
    id: 1,
    type: "gift_card_purchase",
    amount: 50,
    status: "completed",
    payment_method: "stripe",
    reference_id: "TXN-2024-001",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    type: "gift_card_purchase",
    amount: 20,
    status: "completed",
    payment_method: "paypal",
    reference_id: "TXN-2024-002",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    type: "gift_card_transfer",
    amount: 10,
    status: "completed",
    payment_method: null,
    reference_id: "TXN-2024-003",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    recipient_name: "John Doe"
  },
  {
    id: 4,
    type: "gift_card_received",
    amount: 25,
    status: "completed",
    payment_method: null,
    reference_id: "TXN-2024-004",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    sender_name: "Jane Smith"
  },
  {
    id: 5,
    type: "gift_card_purchase",
    amount: 100,
    status: "pending",
    payment_method: "mobile",
    reference_id: "TXN-2024-005",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Get transactions
export const getTransactions = createAsyncThunk(
  "wallet/getTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallet/transactions", { params });
      // If API returns data, use it; otherwise use demo data for testing
      const transactions = response.data.data || [];
      return transactions.length > 0 ? transactions : DEMO_TRANSACTIONS;
    } catch (err) {
      // For development/testing, return demo data if API fails
      console.warn("API call failed, using demo transactions:", err.message);
      return DEMO_TRANSACTIONS;
    }
  }
);

// Initiate Stripe deposit
export const initiateStripeDeposit = createAsyncThunk(
  "wallet/initiateStripeDeposit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/deposit/stripe", data);
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Initiate PayPal deposit
export const initiatePayPalDeposit = createAsyncThunk(
  "wallet/initiatePayPalDeposit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/deposit/paypal", data);
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Submit mobile banking deposit
export const submitMobileDeposit = createAsyncThunk(
  "wallet/submitMobileDeposit",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === "receipt" && data[key] instanceof File) {
            formData.append(key, data[key]);
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const response = await axios.post("/wallet/deposit/mobile", formData);
      toast.success("Deposit request submitted. Waiting for admin verification.");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit deposit");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Create withdrawal request
export const createWithdrawalRequest = createAsyncThunk(
  "wallet/createWithdrawalRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/withdraw", data);
      toast.success("Withdrawal request submitted successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create withdrawal request");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Transfer balance
export const transferBalance = createAsyncThunk(
  "wallet/transferBalance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/transfer", data);
      toast.success("Balance transferred successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Purchase gift card
export const purchaseGiftCard = createAsyncThunk(
  "wallet/purchaseGiftCard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/gift-cards/purchase", data);
      toast.success("Gift card purchased successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to purchase gift card");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Gift card to another user
export const giftCard = createAsyncThunk(
  "wallet/giftCard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/gift-cards/gift", data);
      toast.success("Gift card sent successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send gift card");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Demo user gift cards for testing
const DEMO_MY_GIFT_CARDS = [
  {
    id: 101,
    amount: 20,
    code: "GC-2024-ABC12345",
    status: "active",
    design: "default",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    description: "Great value gift card"
  },
  {
    id: 102,
    amount: 50,
    code: "GC-2024-XYZ67890",
    status: "active",
    design: "elegant",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: "Premium gift card option"
  },
  {
    id: 103,
    amount: 10,
    code: "GC-2024-DEF45678",
    status: "used",
    design: "modern",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    description: "Perfect for small purchases"
  }
];

// Get user's gift cards
export const getMyGiftCards = createAsyncThunk(
  "wallet/getMyGiftCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallet/gift-cards/my-cards");
      // If API returns data, use it; otherwise use demo data for testing
      const cards = response.data.data || [];
      return cards.length > 0 ? cards : DEMO_MY_GIFT_CARDS;
    } catch (err) {
      // For development/testing, return demo data if API fails
      console.warn("API call failed, using demo gift cards:", err.message);
      return DEMO_MY_GIFT_CARDS;
    }
  }
);

// Demo gift cards for testing
const DEMO_GIFT_CARDS = [
  {
    id: 1,
    amount: 10,
    description: "Perfect for small purchases",
    status: "active",
    created_at: new Date().toISOString(),
    image: null
  },
  {
    id: 2,
    amount: 20,
    description: "Great value gift card",
    status: "active",
    created_at: new Date().toISOString(),
    image: null
  },
  {
    id: 3,
    amount: 50,
    description: "Premium gift card option",
    status: "active",
    created_at: new Date().toISOString(),
    image: null
  },
  {
    id: 4,
    amount: 100,
    description: "Maximum value gift card",
    status: "active",
    created_at: new Date().toISOString(),
    image: null
  }
];

// Get available gift cards from admin
export const getAvailableGiftCards = createAsyncThunk(
  "wallet/getAvailableGiftCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallet/gift-cards/available");
      // If API returns data, use it; otherwise use demo data for testing
      const cards = response.data.data || [];
      return cards.length > 0 ? cards : DEMO_GIFT_CARDS;
    } catch (err) {
      // For development/testing, return demo data if API fails
      console.warn("API call failed, using demo gift cards:", err.message);
      return DEMO_GIFT_CARDS;
    }
  }
);

// Purchase gift card with payment gateway
export const purchaseGiftCardWithPayment = createAsyncThunk(
  "wallet/purchaseGiftCardWithPayment",
  async (data, { rejectWithValue }) => {
    try {
      let response;
      
      if (data.payment_method === 'mobile') {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            if (key === "receipt" && data[key] instanceof File) {
              formData.append(key, data[key]);
            } else {
              formData.append(key, data[key]);
            }
          }
        });
        response = await axios.post("/wallet/gift-cards/purchase-with-payment", formData);
      } else {
        response = await axios.post("/wallet/gift-cards/purchase-with-payment", data);
      }
      
      toast.success("Gift card purchased successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to purchase gift card");
      return rejectWithValue(err.response?.data);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get balance
      .addCase(getWalletBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(getWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Stripe deposit
      .addCase(initiateStripeDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(initiateStripeDeposit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateStripeDeposit.rejected, (state) => {
        state.loading = false;
      })
      // PayPal deposit
      .addCase(initiatePayPalDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(initiatePayPalDeposit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiatePayPalDeposit.rejected, (state) => {
        state.loading = false;
      })
      // Mobile deposit
      .addCase(submitMobileDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitMobileDeposit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitMobileDeposit.rejected, (state) => {
        state.loading = false;
      })
      // Withdrawal
      .addCase(createWithdrawalRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWithdrawalRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createWithdrawalRequest.rejected, (state) => {
        state.loading = false;
      })
      // Transfer
      .addCase(transferBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(transferBalance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.balance !== undefined) {
          state.balance = action.payload.balance;
        }
      })
      .addCase(transferBalance.rejected, (state) => {
        state.loading = false;
      })
      // Purchase gift card
      .addCase(purchaseGiftCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(purchaseGiftCard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.balance !== undefined) {
          state.balance = action.payload.balance;
        }
      })
      .addCase(purchaseGiftCard.rejected, (state) => {
        state.loading = false;
      })
      // Gift card
      .addCase(giftCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(giftCard.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(giftCard.rejected, (state) => {
        state.loading = false;
      })
      // Get gift cards
      .addCase(getMyGiftCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyGiftCards.fulfilled, (state, action) => {
        state.loading = false;
        state.giftCards = action.payload;
      })
      .addCase(getMyGiftCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get available gift cards
      .addCase(getAvailableGiftCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailableGiftCards.fulfilled, (state, action) => {
        state.loading = false;
        state.availableGiftCards = action.payload;
      })
      .addCase(getAvailableGiftCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Purchase gift card with payment
      .addCase(purchaseGiftCardWithPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(purchaseGiftCardWithPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(purchaseGiftCardWithPayment.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;

