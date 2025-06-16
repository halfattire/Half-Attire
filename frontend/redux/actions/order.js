
import { server } from "../../lib/server";
import axios from "axios";

// Get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersUserRequest" });

    const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`);

    dispatch({ type: "getAllOrdersUserSuccess", payload: data.orders || [] });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response?.data?.message || "Failed to fetch orders",
    });
  }
};

// Get all orders of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersShopRequest" });

    const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`);

    dispatch({ type: "getAllOrdersShopSuccess", payload: data.orders || [] });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || "Failed to fetch shop orders",
    });
  }
};

// Get all orders of admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "adminAllOrdersRequest" });

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (data.success && Array.isArray(data.orders)) {
      dispatch({ type: "adminAllOrdersSuccess", payload: data.orders });
      return data.orders;
    } else {
      console.error("Invalid response format:", data);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch admin orders";

    dispatch({
      type: "adminAllOrdersFailed",
      payload: errorMessage,
    });
    return [];
  }
};

// Create order
export const createOrder = (orderData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(`${server}/order/create-order`, orderData, config);

    // After creating order, refresh the orders list
    if (orderData.user?._id) {
      dispatch(getAllOrdersOfUser(orderData.user._id));
    }

    return data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create order";
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: "clearErrors" });
};


