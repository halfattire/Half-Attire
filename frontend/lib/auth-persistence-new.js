/**
 * Authentication Persistence Service
 * Handles authentication state persistence across page reloads in production
 */

// Get authentication data from storage
export const getAuthFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem("token");
    const userDataStr = localStorage.getItem("userData");
    
    if (token && userDataStr) {
      const userData = JSON.parse(userDataStr);
      
      // Validate userData structure
      if (userData && userData._id && userData.email) {
        return { token, userData };
      }
    }
  } catch (error) {
    // Clear corrupted data
    clearAuthFromStorage();
  }
  
  return null;
};

// Set authentication data to storage
export const setAuthToStorage = (token, userData) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    
    // Also set cookies for server-side access
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to save auth data:", error);
  }
};

// Clear authentication data from storage
export const clearAuthFromStorage = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("latestOrder");
  
  // Clear cookies
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "seller_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

// Initialize authentication from stored data
export const initializeAuth = () => {
  const authData = getAuthFromStorage();
  
  if (authData) {
    // Set axios default headers
    if (typeof window !== 'undefined') {
      const axios = require('axios');
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
    }
    
    return authData.userData;
  }
  
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const authData = getAuthFromStorage();
  return authData !== null;
};

// Get current user data
export const getCurrentUser = () => {
  const authData = getAuthFromStorage();
  return authData ? authData.userData : null;
};

// Get current token
export const getCurrentToken = () => {
  const authData = getAuthFromStorage();
  return authData ? authData.token : null;
};
