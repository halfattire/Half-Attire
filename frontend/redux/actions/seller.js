import { server } from "../../lib/server";
import axios from "axios";
import {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFail,
  getAllSellerRequest,
  getAllSellerSuccess,
  getAllSellerFailed,
} from "../reducers/seller";

// getSeller - KEEPING EXISTING FUNCTION NAME
export const getSeller = () => async (dispatch) => {
  try {
    dispatch(loadSellerRequest());
    
    // Get seller token from localStorage
    const sellerToken = localStorage.getItem("seller_token");
    console.log("🔍 getSeller - Seller token available:", sellerToken ? "Yes" : "No");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if seller token exists
    if (sellerToken) {
      config.headers = {
        Authorization: `Bearer ${sellerToken}`,
      };
      console.log("✅ Added seller token to getSeller request");
    }

    const { data } = await axios.get(`${server}/shop/getSeller`, config);

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

    dispatch(loadSellerSuccess(data.seller));
  } catch (error) {
    console.error("getSeller error:", error);
    // Clear seller token if it's invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("seller_token");
      localStorage.removeItem("sellerData");
      console.log("getSeller: Cleared invalid seller tokens");
    }
    dispatch(loadSellerFail(error.response?.data?.message || "Failed to load seller"));
  }
};

// Get all sellers --- only for admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellerRequest());

    // Get admin token from localStorage (not seller token)
    const token = localStorage.getItem("token");
    console.log("🔍 getAllSellers - Admin token available:", token ? "Yes" : "No");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
      console.log("✅ Added admin token to sellers request");
    } else {
      console.error("❌ No admin token available for sellers request!");
    }

    console.log("📡 Making admin sellers request to:", `${server}/shop/admin-all-sellers`);
    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, config);

    dispatch(getAllSellerSuccess(data.sellers));
  } catch (error) {
    console.error("Sellers fetch error:", error);
    dispatch(getAllSellerFailed(error.response?.data?.message || "Failed to fetch sellers"));
  }
};

// Seller logout action
export const logoutSeller = () => async (dispatch) => {
  try {
    // Clear seller token from localStorage
    localStorage.removeItem("seller_token");
    localStorage.removeItem("sellerData");
    console.log("logoutSeller: Cleared seller tokens from localStorage");
    
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
    localStorage.removeItem("sellerData");
    dispatch(loadSellerFail("Seller logged out"));
  }
};

