// Complete Authentication Fix and Diagnostic Script
// Run this in the browser console to diagnose and fix authentication issues

(function() {
  console.log("🔧 === COMPLETE AUTHENTICATION FIX ===");
  
  // Step 1: Comprehensive cleanup
  window.cleanupAuth = function() {
    console.log("🧹 Cleaning up all authentication data...");
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('seller_token');
    localStorage.removeItem('sellerData');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberedPassword');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    console.log("✅ Authentication cleanup completed");
  };
  
  // Step 2: Force login with manual token setting
  window.forceLogin = function(email = "admin@example.com", password = "password123") {
    console.log("🔐 Attempting force login...");
    
    // Simulate login data (replace with actual login API call)
    const fakeUserData = {
      _id: "admin123",
      email: email,
      name: "Admin User",
      role: "admin",
      avatar: null
    };
    
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTIzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzEwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.fake-token";
    
    // Store in localStorage
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('userData', JSON.stringify(fakeUserData));
    
    console.log("✅ Force login data set. Refresh the page to see changes.");
  };
  
  // Step 3: Check current authentication state
  window.checkAuthState = function() {
    console.log("📊 === CURRENT AUTHENTICATION STATE ===");
    
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    const sellerToken = localStorage.getItem('seller_token');
    const sellerData = localStorage.getItem('sellerData');
    
    console.log("User token:", token ? `✅ Present (${token.length} chars)` : "❌ Missing");
    console.log("User data:", userData ? "✅ Present" : "❌ Missing");
    console.log("Seller token:", sellerToken ? `✅ Present (${sellerToken.length} chars)` : "❌ Missing");
    console.log("Seller data:", sellerData ? "✅ Present" : "❌ Missing");
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log("👤 User Details:");
        console.log("- ID:", user._id);
        console.log("- Email:", user.email);
        console.log("- Name:", user.name);
        console.log("- Role:", user.role);
      } catch (e) {
        console.error("❌ Error parsing user data:", e);
      }
    }
    
    if (sellerData) {
      try {
        const seller = JSON.parse(sellerData);
        console.log("🏪 Seller Details:");
        console.log("- ID:", seller._id);
        console.log("- Email:", seller.email);
        console.log("- Name:", seller.name);
      } catch (e) {
        console.error("❌ Error parsing seller data:", e);
      }
    }
    
    // Check Redux state
    if (window.__REDUX_STORE__) {
      const state = window.__REDUX_STORE__.getState();
      console.log("🔄 Redux State:");
      console.log("- User authenticated:", state.user?.isAuthenticated);
      console.log("- Seller authenticated:", state.seller?.isSeller);
    }
  };
  
  // Step 4: Test API endpoints
  window.testEndpoints = async function() {
    console.log("🧪 === TESTING API ENDPOINTS ===");
    
    const token = localStorage.getItem('token');
    const sellerToken = localStorage.getItem('seller_token');
    const baseURL = "http://localhost:8000";
    
    const endpoints = [
      { url: "/api/user/getuser", token: token, type: "User Profile" },
      { url: "/api/order/admin-all-orders", token: token, type: "Admin Orders" },
      { url: "/api/shop/admin-all-sellers", token: token, type: "Admin Sellers" },
      { url: "/api/shop/getSeller", token: sellerToken, type: "Seller Profile" }
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
          console.log("📄 Error:", errorText.substring(0, 200));
        }
        
      } catch (error) {
        console.error("❌ Network error:", error.message);
      }
    }
  };
  
  // Step 5: Fix authentication issues
  window.fixAuth = function() {
    console.log("🔧 === FIXING AUTHENTICATION ISSUES ===");
    
    // 1. Check for tokens without data
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    const sellerToken = localStorage.getItem('seller_token'); 
    const sellerData = localStorage.getItem('sellerData');
    
    if (token && !userData) {
      console.log("🔧 Found token without user data - clearing token");
      localStorage.removeItem('token');
    }
    
    if (sellerToken && !sellerData) {
      console.log("🔧 Found seller token without seller data - clearing token");
      localStorage.removeItem('seller_token');
    }
    
    if (userData && !token) {
      console.log("🔧 Found user data without token - clearing user data");
      localStorage.removeItem('userData');
    }
    
    if (sellerData && !sellerToken) {
      console.log("🔧 Found seller data without token - clearing seller data");
      localStorage.removeItem('sellerData');
    }
    
    // 2. Validate token format
    if (token) {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log("🔧 Invalid token format - clearing");
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    
    if (sellerToken) {
      const parts = sellerToken.split('.');
      if (parts.length !== 3) {
        console.log("🔧 Invalid seller token format - clearing");
        localStorage.removeItem('seller_token');
        localStorage.removeItem('sellerData');
      }
    }
    
    console.log("✅ Authentication fix completed");
  };
  
  // Auto-run diagnostics
  console.log("🚀 Running automatic diagnostics...");
  window.checkAuthState();
  
  console.log("\n📋 Available commands:");
  console.log("- checkAuthState() - Check current authentication");
  console.log("- testEndpoints() - Test API endpoints");
  console.log("- cleanupAuth() - Clear all authentication data");
  console.log("- fixAuth() - Fix common authentication issues");
  console.log("- forceLogin() - Set test authentication data");
  
})();
