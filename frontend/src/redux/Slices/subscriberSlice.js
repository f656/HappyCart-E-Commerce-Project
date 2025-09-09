/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for subscribing
export const subscribeNewsletter = createAsyncThunk(
  "subscriber/subscribeNewsletter",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/subscribe`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const subscriberSlice = createSlice({
  name: "subscriber",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = subscriberSlice.actions;
export default subscriberSlice.reducer;
