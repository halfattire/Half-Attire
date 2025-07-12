import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Set up axios interceptors for authentication
 * This ensures the token is always sent with requests and handles token refresh
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor to add token to all requests
  axios.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
          
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          // Show error message
          toast.error(errorMessage + '. Please login again.');
          
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
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
