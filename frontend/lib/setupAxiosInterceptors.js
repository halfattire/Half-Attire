import axios from 'axios';

// Set up axios interceptors to automatically attach auth tokens
export const setupAxiosInterceptors = () => {
  console.log("🔧 Setting up axios interceptors...");

  // Request interceptor to add authentication headers
  axios.interceptors.request.use(
    (config) => {
      const url = config.url || '';
      console.log(`📤 Axios request to: ${url}`);
      
      // Get tokens from localStorage
      const userToken = localStorage.getItem('token');
      const sellerToken = localStorage.getItem('seller_token');
      
      console.log("Available tokens:", {
        userToken: userToken ? `Present (${userToken.length} chars)` : 'Missing',
        sellerToken: sellerToken ? `Present (${sellerToken.length} chars)` : 'Missing'
      });

      // Determine which token to use based on the URL
      let tokenToUse = null;
      let tokenType = 'none';

      // Admin routes should ALWAYS use user token (admin user token)
      if (url.includes('/admin') || 
          url.includes('/api/order/admin') || 
          url.includes('/api/shop/admin') ||
          url.includes('/api/user/admin')) {
        tokenToUse = userToken;
        tokenType = 'user (admin)';
      } 
      // Shop management routes (non-admin) use seller token
      else if (url.includes('/api/shop/') && 
               !url.includes('/admin') && 
               !url.includes('/get-shop-info')) {
        tokenToUse = sellerToken;
        tokenType = 'seller';
      } 
      // User-specific routes use user token
      else if (url.includes('/api/user/')) {
        tokenToUse = userToken;
        tokenType = 'user';
      } 
      // Order routes (non-admin) prefer user token
      else if (url.includes('/api/order/')) {
        tokenToUse = userToken;
        tokenType = 'user';
      }
      // Default: try user token first (most common)
      else {
        tokenToUse = userToken || sellerToken;
        tokenType = userToken ? 'user (fallback)' : sellerToken ? 'seller (fallback)' : 'none';
      }

      if (tokenToUse) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${tokenToUse}`;
        console.log(`✅ Added ${tokenType} token to request: ${tokenToUse.substring(0, 20)}...`);
      } else {
        console.log(`⚠️ No token available for request to: ${url}`);
      }

      return config;
    },
    (error) => {
      console.error('❌ Axios request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token-related errors
  axios.interceptors.response.use(
    (response) => {
      // Successful response - no action needed
      return response;
    },
    (error) => {
      const url = error.config?.url || 'unknown';
      
      if (error.response?.status === 401) {
        console.error(`🚫 401 Unauthorized error for: ${url}`);
        console.error('Response data:', error.response.data);
        
        // Check if we have the right token for this request
        const userToken = localStorage.getItem('token');
        const sellerToken = localStorage.getItem('seller_token');
        
        console.log("Current token status during 401:", {
          userToken: userToken ? 'Present' : 'Missing',
          sellerToken: sellerToken ? 'Present' : 'Missing',
          requestURL: url
        });
        
        // If it's an admin route and we're missing the user token, redirect to login
        if ((url.includes('/admin') || url.includes('/api/order/admin') || url.includes('/api/shop/admin')) && !userToken) {
          console.log('❌ Admin route requires user token but not found - redirecting to login');
          // You might want to redirect to login here
          // window.location.href = '/login';
        }
        
        // If it's a shop route and we're missing the seller token
        if (url.includes('/api/shop/') && !url.includes('get-shop-info') && !sellerToken) {
          console.log('❌ Shop route requires seller token but not found - redirecting to shop login');
          // You might want to redirect to shop login here
          // window.location.href = '/shop-login';
        }
      }
      
      return Promise.reject(error);
    }
  );

  console.log("✅ Axios interceptors set up successfully");
};

// Export a function to manually attach token to a specific request
export const attachTokenToRequest = (config, forceTokenType = null) => {
  const userToken = localStorage.getItem('token');
  const sellerToken = localStorage.getItem('seller_token');
  
  let tokenToUse = null;
  
  if (forceTokenType === 'user') {
    tokenToUse = userToken;
  } else if (forceTokenType === 'seller') {
    tokenToUse = sellerToken;
  } else {
    // Auto-detect based on URL
    const url = config.url || '';
    if (url.includes('/admin') || url.includes('/api/order/admin') || url.includes('/api/shop/admin')) {
      tokenToUse = userToken;
    } else if (url.includes('/api/shop/')) {
      tokenToUse = sellerToken;
    } else {
      tokenToUse = userToken || sellerToken;
    }
  }
  
  if (tokenToUse) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${tokenToUse}`;
  }
  
  return config;
};
