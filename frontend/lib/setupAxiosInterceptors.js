import axios from 'axios';

// Set up axios interceptors to automatically attach auth tokens
export const setupAxiosInterceptors = () => {
  console.log("🔧 Setting up axios interceptors...");

  // Clear any existing interceptors to avoid duplicates
  axios.interceptors.request.handlers = [];
  axios.interceptors.response.handlers = [];

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

      // Determine which token to use based on the URL path
      let tokenToUse = null;
      let tokenType = 'none';

      // ADMIN ROUTES - Always use user token (admin privileges)
      if (url.includes('/admin') || 
          url.includes('/api/order/admin') || 
          url.includes('/api/shop/admin') ||
          url.includes('/api/user/admin') ||
          url.includes('/newsletter/subscribers') ||
          url.includes('/newsletter/send')) {
        tokenToUse = userToken;
        tokenType = 'user (admin)';
      } 
      // SELLER-SPECIFIC ROUTES - Use seller token
      else if (url.includes('/api/shop/getSeller') ||
               url.includes('/api/shop/update-shop') ||
               url.includes('/api/shop/delete-shop') ||
               url.includes('/api/shop/logout') ||
               (url.includes('/api/shop/') && !url.includes('/get-shop-info') && !url.includes('/admin'))) {
        tokenToUse = sellerToken;
        tokenType = 'seller';
      } 
      // USER ROUTES - Use user token
      else if (url.includes('/api/user/') ||
               url.includes('/api/order/') && !url.includes('/admin')) {
        tokenToUse = userToken;
        tokenType = 'user';
      }
      // PRODUCT/EVENT ROUTES - Context-dependent
      else if (url.includes('/api/product/') || url.includes('/api/event/')) {
        // If it's a shop-specific operation, use seller token
        if (url.includes('/shop') || url.includes('/seller')) {
          tokenToUse = sellerToken;
          tokenType = 'seller';
        } else {
          // Otherwise use user token
          tokenToUse = userToken;
          tokenType = 'user';
        }
      }
      // DEFAULT FALLBACK - Prefer user token
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
      const status = error.response?.status;
      
      if (status === 401) {
        console.error(`🚫 401 Unauthorized error for: ${url}`);
        console.error('Response data:', error.response.data);
        
        // Check what type of route failed
        const userToken = localStorage.getItem('token');
        const sellerToken = localStorage.getItem('seller_token');
        
        console.log("Token status during 401:", {
          userToken: userToken ? 'Present' : 'Missing',
          sellerToken: sellerToken ? 'Present' : 'Missing',
          requestURL: url,
          errorMessage: error.response.data?.message
        });
        
        // Handle specific error messages
        const errorMessage = error.response.data?.message || '';
        
        if (errorMessage.includes('Seller account not found') || 
            errorMessage.includes('Seller authentication required')) {
          console.log('❌ Seller authentication failed - route may need seller token');
          
          // If this is supposed to be a seller route but we don't have seller token
          if (!sellerToken && (url.includes('/shop/') && !url.includes('/admin'))) {
            console.log('❌ Missing seller token for seller route');
          }
        }
        
        if (errorMessage.includes('Admin access required') ||
            errorMessage.includes('Please login to access this resource')) {
          console.log('❌ Admin authentication failed - route needs admin user token');
          
          // If this is an admin route but user doesn't have admin role
          if (userToken && url.includes('/admin')) {
            console.log('❌ User token present but admin access denied - check user role');
          }
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
