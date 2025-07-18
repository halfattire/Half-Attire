import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  addressloading: false,
  successMessage: null,
  adminUsers: [],
  isLoading: false, // Add isLoading for consistency with other reducers
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Update user information
    updateUserInfoRequest: (state) => {
      state.loading = true;
    },
    updateUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateUserInfoFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user address
    updateUserAddressRequest: (state) => {
      state.addressloading = true;
    },
    updateUserAddressSuccess: (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    },
    updateUserAddressFailed: (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    },

    // Delete user address
    deleteUserAddressRequest: (state) => {
      state.addressloading = true;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    },
    deleteUserAddressFailed: (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    },

    // Admin users actions
    adminAllUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    adminAllUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.adminUsers = action.payload || [];
      state.error = null;
    },
    adminAllUsersFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    },

    // Logout
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.adminUsers = [];
    },
  },
});

export const {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateUserInfoFailed,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserAddressFailed,
  updateUserAddressSuccess,
  updateUserAddressRequest,
  deleteUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  adminAllUsersRequest,
  adminAllUsersSuccess,
  adminAllUsersFailed,
  clearErrors,
  logoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;