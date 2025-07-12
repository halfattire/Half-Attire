import axios from "axios";
import { server } from "../../lib/server";

// Create withdraw request
export const createWithdrawRequest = (withdrawData) => async (dispatch) => {
  try {
    dispatch({
      type: "CREATE_WITHDRAW_REQUEST",
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/withdraw/create-withdraw-request`,
      withdrawData,
      config
    );

    dispatch({
      type: "CREATE_WITHDRAW_SUCCESS",
      payload: data.withdraw,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "CREATE_WITHDRAW_FAIL",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Get seller's withdraw requests
export const getSellerWithdraws = () => async (dispatch) => {
  try {
    dispatch({
      type: "GET_SELLER_WITHDRAWS_REQUEST",
    });

    const { data } = await axios.get(
      `${server}/withdraw/get-seller-withdraws`,
      { withCredentials: true }
    );

    dispatch({
      type: "GET_SELLER_WITHDRAWS_SUCCESS",
      payload: {
        withdraws: data.withdraws,
        stats: data.stats,
      },
    });
  } catch (error) {
    dispatch({
      type: "GET_SELLER_WITHDRAWS_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all withdraw requests (Admin)
export const getAllWithdrawRequests = () => async (dispatch) => {
  try {
    dispatch({
      type: "GET_ALL_WITHDRAWS_REQUEST",
    });

    const { data } = await axios.get(
      `${server}/withdraw/get-all-withdraw-request`,
      { withCredentials: true }
    );

    dispatch({
      type: "GET_ALL_WITHDRAWS_SUCCESS",
      payload: data.withdraws,
    });
  } catch (error) {
    dispatch({
      type: "GET_ALL_WITHDRAWS_FAIL",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update withdraw request (Admin)
export const updateWithdrawRequest = (id, updateData) => async (dispatch) => {
  try {
    dispatch({
      type: "UPDATE_WITHDRAW_REQUEST",
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${server}/withdraw/update-withdraw-request/${id}`,
      updateData,
      config
    );

    dispatch({
      type: "UPDATE_WITHDRAW_SUCCESS",
      payload: data.withdraw,
    });

    return data;
  } catch (error) {
    dispatch({
      type: "UPDATE_WITHDRAW_FAIL",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: "CLEAR_ERRORS",
  });
};
