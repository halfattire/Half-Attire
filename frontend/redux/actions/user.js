import axios from "axios";
import { server } from "../../lib/server";
import { logoutUser } from "../../lib/auth-service";
import {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserInfoFailed,
  updateUserAddressFailed,
  updateUserAddressRequest,
  updateUserAddressSuccess,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  deleteUserAddressFailed,
  adminAllUsersRequest,
  adminAllUsersSuccess,
  adminAllUsersFailed,
} from "../reducers/user.js";
import { loadSellerFail, loadSellerRequest, loadSellerSuccess } from "../reducers/seller.js";

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });

    // Store user data in localStorage
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    console.error("Load user error:", error);

    // If we get 401, user is not authenticated - clear everything
    if (error.response?.status === 401) {
      localStorage.removeItem("userData");
      dispatch(loadUserFail("Please login to continue"));
    } else {
      dispatch(loadUserFail(error.response?.data?.message || "Failed to load user"));
    }
  }
};

// Logout action
export const logout = () => async (dispatch) => {
  try {
    // Use the comprehensive logout function
    const result = await logoutUser();

    // Clear Redux state regardless of result
    dispatch({ type: "LOGOUT_SUCCESS" });

    return result;
  } catch (error) {
    console.error("Logout action error:", error);

    // Clear Redux state even if logout fails
    dispatch({ type: "LOGOUT_SUCCESS" });

    return { success: false, error };
  }
};

// Load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch(loadSellerRequest());
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch(loadSellerSuccess(data.seller));
  } catch (error) {
    dispatch(loadSellerFail(error.response?.data?.message || "Failed to load seller"));
  }
};

export const updateUserInfomation = (name, phoneNumber) => async (dispatch) => {
  try {
    dispatch(updateUserInfoRequest());

    console.log("Updating user info with:", { name, phoneNumber });

    const { data } = await axios.put(
      `${server}/user/update-user-info`,
      {
        name,
        phoneNumber,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Update response:", data);

    // Update localStorage
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(updateUserInfoSuccess(data.user));

    return data;
  } catch (error) {
    console.error("Update user info error:", error);

    // If 401, user session expired
    if (error.response?.status === 401) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      localStorage.removeItem("userData");
    }

    const errorMessage = error.response?.data?.message || "Failed to update profile";
    dispatch(updateUserInfoFailed(errorMessage));

    return { success: false, error: errorMessage };
  }
};

// Update user address
export const updateUserAddress = (country, city, address1, address2, addressType, zipCode) => async (dispatch) => {
  try {
    dispatch(updateUserAddressRequest());
    const { data } = await axios.put(
      `${server}/user/update-user-addresses`,
      { country, city, address1, address2, addressType, zipCode },
      { withCredentials: true },
    );

    // Update localStorage
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(updateUserAddressSuccess({ user: data.user }));
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      localStorage.removeItem("userData");
    }
    dispatch(updateUserAddressFailed(error.response?.data?.message || "Failed to update address"));
  }
};

// Delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserAddressRequest());
    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, { withCredentials: true });

    // Update localStorage
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(deleteUserAddressSuccess({ user: data.user }));
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      localStorage.removeItem("userData");
    }
    dispatch(deleteUserAddressFailed(error.response?.data?.message || "Failed to delete address"));
  }
};

// Action to get all users for admin
export const getAllUsersAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllUsersRequest());

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch(adminAllUsersSuccess(data.users));
    return data.users;
  } catch (error) {
    console.error("Admin users fetch error:", error);
    dispatch(adminAllUsersFailed(error.response?.data?.message || "Failed to fetch admin users"));
    return [];
  }
};