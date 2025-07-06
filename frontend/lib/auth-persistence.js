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
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "seller_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Check if user is authenticated
export const isUserAuthenticated = () => {
  const authData = getAuthFromStorage();
  return !!authData;
};

// Initialize authentication state on app start
export const initializeAuth = () => {
  if (typeof window === 'undefined') return null;
  
  const authData = getAuthFromStorage();
  
  if (authData) {
    return authData.userData;
  }
  
  return null;
};
