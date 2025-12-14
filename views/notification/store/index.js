"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/helpers/axios";
import { toast } from "react-toastify";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
};

// Fetch notifications
export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async ({ page = 1, perPage = 20, isRead = null }, { rejectWithValue }) => {
    try {
      let url = `/notifications?page=${page}&per_page=${perPage}`;
      if (isRead !== null) {
        url += `&is_read=${isRead ? 1 : 0}`;
      }
      const response = await axios.get(url);
      return {
        data: response.data.data.data || [],
        currentPage: response.data.data.current_page,
        lastPage: response.data.data.last_page,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Get unread notification count
export const getUnreadCount = createAsyncThunk(
  "notification/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/notifications/unread-count");
      return response.data.data.unread_count;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Mark notification as read
export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/notifications/${notificationId}/mark-as-read`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/notifications/mark-all-as-read");
      toast.success("All notifications marked as read");
      return response.data.data.updated_count;
    } catch (err) {
      toast.error("Failed to mark all as read");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      toast.success("Notification deleted");
      return notificationId;
    } catch (err) {
      toast.error("Failed to delete notification");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Delete all notifications
export const deleteAllNotifications = createAsyncThunk(
  "notification/deleteAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete("/notifications");
      toast.success("All notifications deleted");
      return response.data.data.deleted_count;
    } catch (err) {
      toast.error("Failed to delete all notifications");
      return rejectWithValue(err.response?.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Add a new notification (for real-time updates)
    addNotification: (state, action) => {
      const exists = state.notifications.find(n => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.is_read) {
          state.unreadCount += 1;
        }
      }
    },
    // Update unread count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    // Decrement unread count
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.hasMore = true;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    // Get Notifications
    builder.addCase(getNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.currentPage === 1) {
        state.notifications = action.payload.data;
      } else {
        state.notifications = [...state.notifications, ...action.payload.data];
      }
      state.currentPage = action.payload.currentPage;
      state.hasMore = action.payload.currentPage < action.payload.lastPage;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch notifications";
    });

    // Get Unread Count
    builder.addCase(getUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
    });

    // Mark As Read
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload.id);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        notification.read_at = action.payload.read_at;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // Mark All As Read
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.notifications.forEach(n => {
        n.is_read = true;
        n.read_at = new Date().toISOString();
      });
      state.unreadCount = 0;
    });

    // Delete Notification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    });

    // Delete All Notifications
    builder.addCase(deleteAllNotifications.fulfilled, (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    });
  },
});

export const {
  addNotification,
  setUnreadCount,
  decrementUnreadCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

