import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSeller: false,
  isLoading: true,
  seller: null,
  sellers: null,
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    loadSellerRequest: (state) => {
      state.isLoading = true;
    },
    loadSellerSuccess: (state, action) => {
      state.isSeller = true;
      state.isLoading = false;
      state.seller = action.payload;
    },
    loadSellerFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    },

    //get all sellers Admin
    getAllSellerRequest: (state) => {
      state.isLoading = true;
    },
    getAllSellerSuccess: (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
    },
    getAllSellerFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFail,
  getAllSellerRequest,
  getAllSellerSuccess,
  getAllSellerFailed,
  clearErrors,
} = sellerSlice.actions;

export default sellerSlice.reducer;