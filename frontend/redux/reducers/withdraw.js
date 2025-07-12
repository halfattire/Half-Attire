import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  withdraws: [],
  withdraw: null,
  stats: {
    availableBalance: 0,
    totalWithdrawn: 0,
    pendingAmount: 0,
    totalRequests: 0,
  },
  allWithdraws: [],
  error: null,
  success: false,
};

export const withdrawReducer = createReducer(initialState, (builder) => {
  builder
    // Create withdraw request
    .addCase("CREATE_WITHDRAW_REQUEST", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("CREATE_WITHDRAW_SUCCESS", (state, action) => {
      state.loading = false;
      state.withdraw = action.payload;
      state.success = true;
      state.error = null;
    })
    .addCase("CREATE_WITHDRAW_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get seller withdraws
    .addCase("GET_SELLER_WITHDRAWS_REQUEST", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("GET_SELLER_WITHDRAWS_SUCCESS", (state, action) => {
      state.loading = false;
      state.withdraws = action.payload.withdraws;
      state.stats = action.payload.stats;
      state.error = null;
    })
    .addCase("GET_SELLER_WITHDRAWS_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Get all withdraws (Admin)
    .addCase("GET_ALL_WITHDRAWS_REQUEST", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("GET_ALL_WITHDRAWS_SUCCESS", (state, action) => {
      state.loading = false;
      state.allWithdraws = action.payload;
      state.error = null;
    })
    .addCase("GET_ALL_WITHDRAWS_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Update withdraw request (Admin)
    .addCase("UPDATE_WITHDRAW_REQUEST", (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase("UPDATE_WITHDRAW_SUCCESS", (state, action) => {
      state.loading = false;
      state.withdraw = action.payload;
      state.success = true;
      state.error = null;
      // Update the withdraw in allWithdraws array
      const index = state.allWithdraws.findIndex(
        (w) => w._id === action.payload._id
      );
      if (index !== -1) {
        state.allWithdraws[index] = action.payload;
      }
    })
    .addCase("UPDATE_WITHDRAW_FAIL", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Clear errors
    .addCase("CLEAR_ERRORS", (state) => {
      state.error = null;
    })

    // Reset success state
    .addCase("RESET_WITHDRAW_SUCCESS", (state) => {
      state.success = false;
    });
});
