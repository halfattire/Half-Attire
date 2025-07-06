import axios from 'axios';

/**
 * Set up axios interceptors for authentication
 * This ensures the token is always sent with requests
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

  // Response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors when this module is imported
if (typeof window !== 'undefined') {
  setupAxiosInterceptors();
}
