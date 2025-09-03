import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  mobile: null,
  loading: false,
  error: null,
  otpRequested: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setMobile: (state, action) => {
      state.mobile = action.payload;
    },
    setOtpRequested: (state, action) => {
      state.otpRequested = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.access_token;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.mobile = null;
      state.otpRequested = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setMobile,
  setOtpRequested,
  loginSuccess,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
