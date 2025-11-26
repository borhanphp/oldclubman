import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import errorResponse from "@/utility";
import toast from "react-hot-toast";

const initialState = {
  balance: 0,
  giftCardTotalValue: 0,
  transactions: [],
  giftCards: [],
  availableGiftCards: [],
  paymentGateways: [],
  pendingPurchase: null, // Stores pending purchase data for OTP verification
  pendingTransfer: null, // Stores pending transfer data for OTP verification
  loading: false,
  error: null,
};

// Get wallet balance (includes gift card total value)
export const getWalletBalance = createAsyncThunk(
  "wallet/getWalletBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallet/balance");
      console.log('🔍 Wallet Balance API Response:', response.data);
      const data = response.data.data || {};
      console.log('📊 Extracted data:', data);
      
      // Extract balance - can be balance_cents, balance_dollars, or balance
      let balanceValue = 0;
      if (data.balance_cents !== undefined) {
        balanceValue = data.balance_cents / 100; // Convert cents to dollars
        console.log('💰 Converted from cents:', data.balance_cents, '→', balanceValue);
      } else if (data.balance_dollars !== undefined) {
        balanceValue = parseFloat(data.balance_dollars);
        console.log('💰 Used balance_dollars:', balanceValue);
      } else if (data.balance !== undefined) {
        balanceValue = parseFloat(data.balance);
        console.log('💰 Used balance:', balanceValue);
      }
      
      // Gift card total value is the same as balance (wallet balance = gift card value)
      const giftCardValue = data.gift_card_total_value || data.total_gift_cards_value || balanceValue;
      console.log('🎁 Gift Card Value:', giftCardValue);
      
      const result = {
        balance: balanceValue,
        giftCardTotalValue: giftCardValue
      };
      console.log('✅ Final result being returned:', result);
      
      return result;
    } catch (err) {
      console.error('❌ Get Wallet Balance Error:', err);
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
      toast.success("Transfer request submitted successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create transfer request");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Transfer balance - Step 1: Initiate transfer (send gift card)
export const transferBalance = createAsyncThunk(
  "wallet/transferBalance",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/transfer/initiate", data);
      toast.success("OTP sent! Please verify to complete the transfer.");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate transfer");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Transfer balance - Step 2: Verify OTP and complete
export const verifyTransferOTP = createAsyncThunk(
  "wallet/verifyTransferOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/transfer/verify-otp", {
        transfer_request_id: data.transfer_request_id,
        otp_code: data.otp_code
      });
      toast.success("Gift card sent successfully!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete transfer");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Resend OTP for transfer
export const resendTransferOTP = createAsyncThunk(
  "wallet/resendTransferOTP",
  async (transfer_request_id, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/transfer/resend-otp", {
        transfer_request_id
      });
      toast.success("OTP resent successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Cancel transfer request
export const cancelTransferRequest = createAsyncThunk(
  "wallet/cancelTransferRequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/wallet/transfer/${data.transfer_request_id}/request-cancel`, {
        reason: data.reason
      });
      toast.success("Transfer request cancelled successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel transfer request");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Purchase gift card - Step 1: Initiate purchase (sends OTP)
export const initiateGiftCardPurchase = createAsyncThunk(
  "wallet/initiateGiftCardPurchase",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/purchase/initiate", {
        product_type: "gift_card",
        product_id: data.gift_card_id,
        quantity: data.quantity || 1,
        notes: data.notes || null
      });
      toast.success("OTP sent! Please check your email/SMS");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate gift card purchase");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Purchase gift card - Step 2: Verify OTP and complete
export const verifyGiftCardPurchase = createAsyncThunk(
  "wallet/verifyGiftCardPurchase",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/purchase/verify-otp", {
        purchase_request_id: data.purchase_request_id,
        otp_code: data.otp_code
      });
      toast.success("Gift card purchased successfully!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete gift card purchase");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Resend OTP for gift card purchase
export const resendGiftCardOTP = createAsyncThunk(
  "wallet/resendGiftCardOTP",
  async (purchase_request_id, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/purchase/resend-otp", {
        purchase_request_id
      });
      toast.success("OTP resent successfully");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
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

// Get user's gift cards (from purchase history)
export const getMyGiftCards = createAsyncThunk(
  "wallet/getMyGiftCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/wallet/purchase/history?product_type=gift_card");
      // Extract completed purchases
      const purchases = response.data.data?.data || [];
      const giftCards = purchases
        .filter(p => p.status === 'completed')
        .map(p => ({
          id: p.id,
          code: p.product_details?.code || `GC-${p.id.slice(0, 8)}`,
          amount: p.total_amount_cents / 100,
          status: 'issued',
          design: 'default',
          created_at: p.created_at,
          description: p.notes || `Gift Card - $${(p.total_amount_cents / 100).toFixed(2)}`
        }));
      return giftCards.length > 0 ? giftCards : DEMO_MY_GIFT_CARDS;
    } catch (err) {
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

// Get payment gateways
export const getPaymentGateways = createAsyncThunk(
  "wallet/getPaymentGateways",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/payment-gateways");
      return response.data.data || [];
    } catch (err) {
      console.error("Failed to fetch payment gateways:", err.message);
      return rejectWithValue(err.response?.data);
    }
  }
);

// Initiate wallet deposit (for gift card purchase)
export const initiateWalletDeposit = createAsyncThunk(
  "wallet/initiateWalletDeposit",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('amount_dollars', data.amount_dollars);
      formData.append('payment_gateway_id', data.payment_gateway_id);
      
      const response = await axios.post("/wallet/deposit/initiate", formData);
      
      if (response.data.success) {
        toast.success("Payment initiated successfully!");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to initiate payment");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to initiate deposit";
      toast.error(errorMessage);
      return rejectWithValue(err.response?.data);
    }
  }
);

// Confirm wallet deposit
export const confirmWalletDeposit = createAsyncThunk(
  "wallet/confirmWalletDeposit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/wallet/deposit/confirm", data);
      
      if (response.data.success) {
        toast.success("Deposit confirmed successfully!");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to confirm deposit");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to confirm deposit";
      toast.error(errorMessage);
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
        console.log('🔄 getWalletBalance.fulfilled - action.payload:', action.payload);
        state.loading = false;
        state.balance = action.payload.balance || action.payload;
        state.giftCardTotalValue = action.payload.giftCardTotalValue || 0;
        console.log('✅ Redux state updated - balance:', state.balance, 'giftCardTotalValue:', state.giftCardTotalValue);
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
      // Transfer - Initiate
      .addCase(transferBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(transferBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTransfer = action.payload; // Store pending transfer data for OTP verification
      })
      .addCase(transferBalance.rejected, (state) => {
        state.loading = false;
      })
      // Transfer - Verify OTP
      .addCase(verifyTransferOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyTransferOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTransfer = null; // Clear pending transfer
        if (action.payload?.new_balance_cents !== undefined) {
          state.balance = action.payload.new_balance_cents / 100;
        }
      })
      .addCase(verifyTransferOTP.rejected, (state) => {
        state.loading = false;
      })
      // Transfer - Resend OTP
      .addCase(resendTransferOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendTransferOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (state.pendingTransfer) {
          state.pendingTransfer.otp_id = action.payload.otp_id;
          state.pendingTransfer.otp_expires_at = action.payload.otp_expires_at;
        }
      })
      .addCase(resendTransferOTP.rejected, (state) => {
        state.loading = false;
      })
      // Cancel transfer request
      .addCase(cancelTransferRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelTransferRequest.fulfilled, (state) => {
        state.loading = false;
        state.pendingTransfer = null; // Clear pending transfer
      })
      .addCase(cancelTransferRequest.rejected, (state) => {
        state.loading = false;
      })
      // Initiate gift card purchase
      .addCase(initiateGiftCardPurchase.pending, (state) => {
        state.loading = true;
      })
      .addCase(initiateGiftCardPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPurchase = action.payload; // Store pending purchase data for OTP verification
      })
      .addCase(initiateGiftCardPurchase.rejected, (state) => {
        state.loading = false;
      })
      // Verify gift card purchase
      .addCase(verifyGiftCardPurchase.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyGiftCardPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingPurchase = null; // Clear pending purchase
        if (action.payload?.new_balance_cents !== undefined) {
          state.balance = action.payload.new_balance_cents / 100;
        }
      })
      .addCase(verifyGiftCardPurchase.rejected, (state) => {
        state.loading = false;
      })
      // Resend OTP
      .addCase(resendGiftCardOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendGiftCardOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (state.pendingPurchase) {
          state.pendingPurchase.otp_id = action.payload.otp_id;
          state.pendingPurchase.otp_expires_at = action.payload.otp_expires_at;
        }
      })
      .addCase(resendGiftCardOTP.rejected, (state) => {
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
      })
      // Get payment gateways
      .addCase(getPaymentGateways.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaymentGateways.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentGateways = action.payload;
      })
      .addCase(getPaymentGateways.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Initiate wallet deposit
      .addCase(initiateWalletDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(initiateWalletDeposit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initiateWalletDeposit.rejected, (state) => {
        state.loading = false;
      })
      // Confirm wallet deposit
      .addCase(confirmWalletDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(confirmWalletDeposit.fulfilled, (state, action) => {
        state.loading = false;
        // Update balance if returned
        if (action.payload?.new_balance_cents) {
          state.balance = action.payload.new_balance_cents / 100;
        }
      })
      .addCase(confirmWalletDeposit.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;

