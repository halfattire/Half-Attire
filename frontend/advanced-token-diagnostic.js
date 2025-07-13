// Advanced Token Diagnostic Script
// Run this in browser console to diagnose authentication issues

window.advancedTokenDiagnostic = function() {
  console.log("🔬 === ADVANCED TOKEN DIAGNOSTIC ===");
  
  // Step 1: Check token existence and format
  const userToken = localStorage.getItem("token");
  const sellerToken = localStorage.getItem("seller_token");
  const userData = localStorage.getItem("userData");
  const sellerData = localStorage.getItem("sellerData");
  
  console.log("📋 Token Inventory:");
  console.log("User token:", userToken ? `✅ Present (${userToken.length} chars)` : "❌ Missing");
  console.log("Seller token:", sellerToken ? `✅ Present (${sellerToken.length} chars)` : "❌ Missing");
  console.log("User data:", userData ? "✅ Present" : "❌ Missing");
  console.log("Seller data:", sellerData ? "✅ Present" : "❌ Missing");
  
  // Step 2: Decode JWT tokens (basic check)
  function tryDecodeJWT(token, tokenType) {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log(`❌ ${tokenType} token invalid format (not JWT)`);
        return null;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < now;
      
      console.log(`🔍 ${tokenType} Token Decoded:`, {
        userId: payload.id || payload.userId || payload.sub,
        email: payload.email,
        role: payload.role,
        exp: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiration',
        isExpired: isExpired ? '❌ EXPIRED' : '✅ Valid',
        timeLeft: payload.exp ? Math.floor((payload.exp - now) / 3600) + ' hours' : 'Unknown'
      });
      
      return { payload, isExpired };
    } catch (error) {
      console.error(`❌ Error decoding ${tokenType} token:`, error);
      return null;
    }
  }
  
  const userTokenInfo = tryDecodeJWT(userToken, "User");
  const sellerTokenInfo = tryDecodeJWT(sellerToken, "Seller");
  
  // Step 3: Check user data structure
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("👤 User Data Structure:", {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'No role specified',
        isAdmin: user.role === 'Admin' ? '✅ IS ADMIN' : '❌ NOT ADMIN'
      });
      
      // Check if user should have admin access
      if (user.role !== 'Admin') {
        console.warn("⚠️ User does not have Admin role - admin routes will fail!");
      }
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }
  
  // Step 4: Test manual API call to admin endpoint
  window.testAdminAPICall = async function() {
    console.log("🧪 Testing manual admin API call...");
    
    if (!userToken) {
      console.error("❌ No user token available for admin call");
      return;
    }
    
    try {
      const response = await fetch('https://halfattire-backend.onrender.com/api/order/admin-all-orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log("📡 Admin API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      const responseText = await response.text();
      console.log("📄 Response body:", responseText);
      
      if (response.status === 401) {
        console.error("🚫 401 Unauthorized - Check token validity and user admin role");
      }
      
    } catch (error) {
      console.error("❌ Admin API call failed:", error);
    }
  };
  
  // Step 5: Check axios configuration
  console.log("🔧 Axios Configuration Check:");
  if (typeof axios !== 'undefined') {
    console.log("Axios interceptors count:", {
      request: axios.interceptors.request.handlers.length,
      response: axios.interceptors.response.handlers.length
    });
  } else {
    console.log("❌ Axios not available in global scope");
  }
  
  console.log("\n🔧 Available commands:");
  console.log("- window.testAdminAPICall() - Test admin API manually");
  console.log("- Check user role in userData for admin privileges");
  console.log("========================");
};

// Auto-run diagnostic
if (typeof window !== 'undefined') {
  console.log("🔬 Advanced token diagnostic loaded");
  console.log("Run window.advancedTokenDiagnostic() to start");
}
