import axios from "axios";
import { server } from "../../lib/server";
import { logoutUser } from "../../lib/auth-service";
import { setAuthToStorage, clearAuthFromStorage } from "../../lib/auth-persistence";
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
    
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    
    const { data } = await axios.get(`${server}/user/getuser`, config);

    // Store user data using the persistence service
    if (data.user && data.token) {
      setAuthToStorage(data.token, data.user);
    } else if (data.user) {
      // If no token returned, keep existing token but update user data
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    // Error loading user

    // If we get 401, user is not authenticated - clear everything
    if (error.response?.status === 401) {
      clearAuthFromStorage();
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
    dispatch({ type: "user/logoutSuccess" });

    return result;
  } catch (error) {
    console.error("Logout action error:", error);

    // Clear Redux state even if logout fails
    dispatch({ type: "user/logoutSuccess" });

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
    dispatch(updateUserInfoRequest());    // Updating user info with: { name, phoneNumber }
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

    // Update response available

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
    
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    
    const { data } = await axios.put(
      `${server}/user/update-user-addresses`,
      { country, city, address1, address2, addressType, zipCode },
      config,
    );

    // Update localStorage
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(updateUserAddressSuccess({ user: data.user }));
    return { success: true, user: data.user };
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    }
    const errorMessage = error.response?.data?.message || "Failed to update address";
    dispatch(updateUserAddressFailed(errorMessage));
    throw new Error(errorMessage);
  }
};

// Delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserAddressRequest());
    
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    
    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, config);

    // Update localStorage
    if (data.user) {
      localStorage.setItem("userData", JSON.stringify(data.user));
    }

    dispatch(deleteUserAddressSuccess({ user: data.user }));
    return { success: true, user: data.user };
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    }
    const errorMessage = error.response?.data?.message || "Failed to delete address";
    dispatch(deleteUserAddressFailed(errorMessage));
    throw new Error(errorMessage);
  }
};

// Action to get all users for admin
export const getAllUsersAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllUsersRequest());

    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const { data } = await axios.get(`${server}/user/admin-all-users`, config);

    dispatch(adminAllUsersSuccess(data.users));
    return data.users;
  } catch (error) {
    dispatch(adminAllUsersFailed(error.response?.data?.message || "Failed to fetch admin users"));
    return [];
  }
};