import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserToken, getSellerToken, clearUserToken, clearSellerToken } from './token-persistence';

/**
 * Set up axios interceptors for authentication
 * This ensures the token is always sent with requests and handles token refresh
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor to add appropriate token to all requests
  axios.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        // Check if this is a seller-related request
        const isSellerRequest = config.url?.includes('/shop/') || 
                               config.url?.includes('/seller') ||
                               config.url?.includes('/dashboard');
        
        if (isSellerRequest) {
          const sellerToken = getSellerToken();
          if (sellerToken) {
            config.headers.Authorization = `Bearer ${sellerToken}`;
          }
        } else {
          const userToken = getUserToken();
          if (userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration and other errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (typeof window !== 'undefined') {
        if (error.response?.status === 401) {
          // Token expired or invalid
          const errorMessage = error.response?.data?.message || 'Session expired';
          
          // Determine if this was a seller or user request
          const isSellerRequest = error.config?.url?.includes('/shop/') || 
                                 error.config?.url?.includes('/seller') ||
                                 error.config?.url?.includes('/dashboard');
          
          if (isSellerRequest) {
            // Clear seller authentication data
            clearSellerToken();
            toast.error(errorMessage + '. Please login to your shop again.');
            setTimeout(() => {
              window.location.href = '/shop-login';
            }, 2000);
          } else {
            // Clear user authentication data
            clearUserToken();
            toast.error(errorMessage + '. Please login again.');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
        } else if (error.response?.status === 403) {
          // Forbidden - insufficient privileges
          toast.error('You do not have permission to perform this action');
        } else if (error.response?.status === 500) {
          // Server error
          toast.error('Server error. Please try again later.');
        }
      }
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors when this module is imported
if (typeof window !== 'undefined') {
  setupAxiosInterceptors();
}
