// Authentication Diagnostic and Fix Script
// Copy and paste this entire script into your browser console

(function() {
  console.log("🔬 === AUTHENTICATION DIAGNOSTIC & FIX ===");
  
  // Step 1: Check current authentication state
  const token = localStorage.getItem("token");
  const sellerToken = localStorage.getItem("seller_token");
  const userData = localStorage.getItem("userData");
  const sellerData = localStorage.getItem("sellerData");
  
  console.log("📋 Current Authentication State:");
  console.log("User token:", token ? `✅ Present (${token.length} chars)` : "❌ Missing");
  console.log("Seller token:", sellerToken ? `✅ Present (${sellerToken.length} chars)` : "❌ Missing");
  console.log("User data:", userData ? "✅ Present" : "❌ Missing");
  console.log("Seller data:", sellerData ? "✅ Present" : "❌ Missing");
  
  // Step 2: Parse user data
  let user = null;
  if (userData) {
    try {
      user = JSON.parse(userData);
      console.log("👤 User Information:");
      console.log("- ID:", user._id);
      console.log("- Email:", user.email);
      console.log("- Name:", user.name);
      console.log("- Role:", user.role);
      console.log("- Is Admin:", user.role && user.role.toLowerCase() === "admin" ? "✅ YES" : "❌ NO");
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }
  
  // Step 3: Parse seller data
  let seller = null;
  if (sellerData) {
    try {
      seller = JSON.parse(sellerData);
      console.log("🏪 Seller Information:");
      console.log("- ID:", seller._id);
      console.log("- Email:", seller.email);
      console.log("- Name:", seller.name);
    } catch (e) {
      console.error("❌ Error parsing seller data:", e);
    }
  }
  
  // Step 4: Test API endpoints manually
  window.testAuthenticationEndpoints = async function() {
    console.log("\n🧪 === TESTING AUTHENTICATION ENDPOINTS ===");
    
    const baseURL = "https://halfattire-backend.onrender.com";
    const endpoints = [
      { url: "/api/order/admin-all-orders", token: token, type: "Admin Orders" },
      { url: "/api/shop/admin-all-sellers", token: token, type: "Admin Sellers" },
      { url: "/newsletter/subscribers", token: token, type: "Newsletter" },
      { url: "/api/shop/getSeller", token: sellerToken, type: "Get Seller" }
    ];
    
    for (const endpoint of endpoints) {
      if (!endpoint.token) {
        console.log(`⚠️ Skipping ${endpoint.type} - No token available`);
        continue;
      }
      
      console.log(`\n📡 Testing: ${endpoint.type} (${endpoint.url})`);
      
      try {
        const response = await fetch(baseURL + endpoint.url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${endpoint.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log(`📊 Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log("✅ SUCCESS!");
          const data = await response.json();
          console.log("📄 Response keys:", Object.keys(data));
        } else {
          console.error("❌ FAILED");
          const errorText = await response.text();
          console.log("📄 Error:", errorText);
        }
        
      } catch (error) {
        console.error("❌ Network error:", error.message);
      }
    }
  };
  
  // Step 5: Fix common issues
  window.fixAuthenticationIssues = function() {
    console.log("\n🔧 === FIXING AUTHENTICATION ISSUES ===");
    
    // Check if tokens are JWT format
    function isValidJWT(token) {
      if (!token) return false;
      const parts = token.split('.');
      return parts.length === 3;
    }
    
    if (token && !isValidJWT(token)) {
      console.log("❌ User token is not valid JWT format - clearing");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
    
    if (sellerToken && !isValidJWT(sellerToken)) {
      console.log("❌ Seller token is not valid JWT format - clearing");
      localStorage.removeItem("seller_token");
      localStorage.removeItem("sellerData");
    }
    
    // Check token expiration
    function checkTokenExpiration(token, tokenType) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp && payload.exp < now;
        
        if (isExpired) {
          console.log(`❌ ${tokenType} token is expired - clearing`);
          if (tokenType === 'User') {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
          } else {
            localStorage.removeItem("seller_token");
            localStorage.removeItem("sellerData");
          }
          return false;
        }
        return true;
      } catch (e) {
        console.log(`❌ Error checking ${tokenType} token expiration:`, e);
        return false;
      }
    }
    
    if (token) checkTokenExpiration(token, 'User');
    if (sellerToken) checkTokenExpiration(sellerToken, 'Seller');
    
    console.log("✅ Authentication cleanup completed");
  };
  
  // Step 6: Reload axios interceptors
  window.reloadAxiosInterceptors = function() {
    console.log("\n🔄 === RELOADING AXIOS INTERCEPTORS ===");
    
    if (typeof axios !== 'undefined') {
      // Clear existing interceptors
      axios.interceptors.request.handlers = [];
      axios.interceptors.response.handlers = [];
      console.log("✅ Cleared existing interceptors");
      
      // You can manually trigger the setup function if available
      if (typeof setupAxiosInterceptors === 'function') {
        setupAxiosInterceptors();
      } else {
        console.log("⚠️ setupAxiosInterceptors function not available globally");
      }
    } else {
      console.log("❌ Axios not available in global scope");
    }
  };
  
  // Auto-run basic checks
  console.log("\n🚀 === DIAGNOSTIC RESULTS ===");
  
  if (!token) {
    console.log("❌ ISSUE: No user token - Please login");
  } else if (!user) {
    console.log("❌ ISSUE: No user data - Authentication incomplete");
  } else if (!user.role || user.role.toLowerCase() !== "admin") {
    console.log("❌ ISSUE: User is not admin - Current role:", user.role);
  } else {
    console.log("✅ User authentication looks good");
  }
  
  if (!sellerToken) {
    console.log("⚠️ INFO: No seller token - Some shop functions may not work");
  } else if (!seller) {
    console.log("⚠️ INFO: No seller data - Seller authentication incomplete");
  } else {
    console.log("✅ Seller authentication looks good");
  }
  
  console.log("\n🔧 Available commands:");
  console.log("- window.testAuthenticationEndpoints() - Test API endpoints");
  console.log("- window.fixAuthenticationIssues() - Fix common auth problems");
  console.log("- window.reloadAxiosInterceptors() - Reload axios configuration");
  
  console.log("========================");
})();
