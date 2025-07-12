// Token persistence utilities for both user and seller authentication

// User token persistence
export const setUserToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("token", token);
  }
};

export const getUserToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

export const clearUserToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  }
};

// Seller token persistence
export const setSellerToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem("seller_token", token);
  }
};

export const getSellerToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("seller_token");
  }
  return null;
};

export const clearSellerToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("seller_token");
    localStorage.removeItem("sellerData");
  }
};

// Combined token management
export const hasAnyToken = () => {
  return getUserToken() || getSellerToken();
};

export const clearAllTokens = () => {
  clearUserToken();
  clearSellerToken();
};

// Check if token is expired (basic check)
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Validate and refresh token if needed
export const validateToken = (token, tokenType = 'user') => {
  if (!token || isTokenExpired(token)) {
    if (tokenType === 'user') {
      clearUserToken();
    } else {
      clearSellerToken();
    }
    return false;
  }
  return true;
};
