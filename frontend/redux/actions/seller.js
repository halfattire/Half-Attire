import { server } from "../../lib/server"
import axios from "axios"
import {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFail,
  getAllSellerRequest,
  getAllSellerSuccess,
  getAllSellerFailed,
} from "../reducers/seller"

// getSeller - KEEPING EXISTING FUNCTION NAME
export const getSeller = () => async (dispatch) => {
  try {
    dispatch(loadSellerRequest())
    
    // Get seller token from localStorage
    const sellerToken = localStorage.getItem("seller_token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if seller token exists
    if (sellerToken) {
      config.headers = {
        Authorization: `Bearer ${sellerToken}`,
      };
    }

    const { data } = await axios.get(`${server}/shop/getSeller`, config)

    console.log("getSeller: Received response, has token:", data.token ? "Yes" : "No");

    // Always store/update seller token if provided in response
    if (data.token) {
      localStorage.setItem("seller_token", data.token);
      console.log("getSeller: Updated seller_token in localStorage");
    }

    // Store seller data in localStorage
    if (data.seller) {
      localStorage.setItem("sellerData", JSON.stringify(data.seller));
      console.log("getSeller: Updated sellerData in localStorage");
    }

    dispatch(loadSellerSuccess(data.seller))
  } catch (error) {
    // Clear seller token if it's invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("seller_token");
    }
    dispatch(loadSellerFail(error.response?.data?.message || "Failed to load seller"))
  }
}

// get all sellers --- admin - KEEPING EXISTING FUNCTION NAME
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellerRequest())

    // Get admin token from localStorage (not seller token)
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

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, config)

    dispatch(getAllSellerSuccess(data.sellers))
  } catch (error) {
    console.error("Sellers fetch error:", error)
    dispatch(getAllSellerFailed(error.response?.data?.message || "Failed to fetch sellers"))
  }
}

// Seller logout action
export const logoutSeller = () => async (dispatch) => {
  try {
    // Clear seller token from localStorage
    localStorage.removeItem("seller_token");
    
    // Call backend logout endpoint
    await axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });

    // Clear seller state in Redux
    dispatch(loadSellerFail("Seller logged out"));
  } catch (error) {
    console.error("Seller logout error:", error);
    // Even if backend logout fails, clear local state
    localStorage.removeItem("seller_token");
    dispatch(loadSellerFail("Seller logged out"));
  }
}

