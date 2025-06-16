
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  adminOrders: [],
  isLoading: false,
  adminOrderLoading: false,
  error: null,
  lastUpdated: null,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // User orders
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload || [];
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Shop orders
    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload || [];
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Admin orders
    .addCase("adminAllOrdersRequest", (state) => {
      state.adminOrderLoading = true;
      state.error = null;
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = Array.isArray(action.payload) ? action.payload : [];
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.adminOrderLoading = false;
      state.adminOrders = [];
      state.error = action.payload;
    })

    // Clear orders
    .addCase("clearOrders", (state) => {
      state.orders = [];
      state.adminOrders = [];
      state.error = null;
      state.lastUpdated = null;
    })

    // Clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});