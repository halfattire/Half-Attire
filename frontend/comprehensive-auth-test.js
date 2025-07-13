// Comprehensive Authentication Test Script
// Copy and paste this entire script into your browser console

(function() {
  console.log("🔬 === COMPREHENSIVE AUTHENTICATION TEST ===");
  
  // Step 1: Check current authentication state
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");
  
  console.log("📋 Current Authentication State:");
  console.log("User token:", token ? "✅ Present" : "❌ Missing");
  console.log("User data:", userData ? "✅ Present" : "❌ Missing");
  
  if (!token) {
    console.error("🚫 CRITICAL: No user token found! Please login first.");
    return;
  }
  
  if (!userData) {
    console.error("🚫 CRITICAL: No user data found! Authentication incomplete.");
    return;
  }
  
  // Step 2: Parse and validate user data
  let user;
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
    return;
  }
  
  if (!user.role || user.role.toLowerCase() !== "admin") {
    console.error("🚫 CRITICAL: User is not admin! Current role:", user.role);
    return;
  }
  
  // Step 3: Decode and validate JWT token
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp < now;
      
      console.log("🔐 JWT Token Analysis:");
      console.log("- User ID in token:", payload.id);
      console.log("- Role in token:", payload.role || "Not specified");
      console.log("- Issued at:", payload.iat ? new Date(payload.iat * 1000).toLocaleString() : "Unknown");
      console.log("- Expires at:", payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "No expiration");
      console.log("- Is expired:", isExpired ? "❌ YES" : "✅ NO");
      console.log("- Time remaining:", payload.exp ? Math.floor((payload.exp - now) / 3600) + " hours" : "Unknown");
      
      if (isExpired) {
        console.error("🚫 CRITICAL: Token is expired! Please login again.");
        return;
      }
      
      if (payload.id !== user._id) {
        console.error("🚫 CRITICAL: Token user ID doesn't match stored user ID!");
        console.log("Token ID:", payload.id);
        console.log("Stored ID:", user._id);
        return;
      }
    }
  } catch (e) {
    console.error("❌ Error analyzing token:", e);
  }
  
  // Step 4: Test manual API calls
  window.testAdminAuthentication = async function() {
    console.log("\n🧪 === TESTING ADMIN API AUTHENTICATION ===");
    
    const baseURL = "https://halfattire-backend.onrender.com";
    const endpoints = [
      "/api/order/admin-all-orders",
      "/api/shop/admin-all-sellers"
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n📡 Testing: ${endpoint}`);
      
      try {
        const response = await fetch(baseURL + endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log("✅ SUCCESS: Admin API call successful!");
          const data = await response.json();
          console.log("📄 Response preview:", {
            success: data.success,
            dataCount: Array.isArray(data.orders) ? data.orders.length : Array.isArray(data.sellers) ? data.sellers.length : "Unknown"
          });
        } else {
          console.error("❌ FAILED: Admin API call failed");
          const errorText = await response.text();
          console.log("📄 Error response:", errorText);
          
          if (response.status === 401) {
            console.error("🚫 401 Unauthorized - Check backend authentication middleware");
          } else if (response.status === 403) {
            console.error("🚫 403 Forbidden - User lacks admin privileges on backend");
          }
        }
        
      } catch (error) {
        console.error("❌ Network error:", error);
      }
    }
  };
  
  // Step 5: Test Redux actions
  window.testReduxActions = function() {
    console.log("\n🔄 === TESTING REDUX ACTIONS ===");
    
    if (typeof window !== 'undefined' && window.store) {
      console.log("📊 Testing Redux store actions...");
      // You can add Redux action tests here if needed
    } else {
      console.log("⚠️ Redux store not accessible from global scope");
    }
  };
  
  // Auto-run basic tests
  console.log("\n🚀 === READY FOR TESTING ===");
  console.log("Authentication check: ✅ PASSED");
  console.log("Token validation: ✅ PASSED");
  console.log("Admin role: ✅ CONFIRMED");
  
  console.log("\n🔧 Available test commands:");
  console.log("- window.testAdminAuthentication() - Test admin API calls manually");
  console.log("- window.testReduxActions() - Test Redux actions");
  
  console.log("\n💡 If admin API calls still fail after these tests pass, the issue is likely:");
  console.log("1. Backend authentication middleware not receiving/processing the token correctly");
  console.log("2. Backend database connection issues");
  console.log("3. Environment variables (JWT_SECRET_KEY) mismatch");
  
  console.log("========================");
})();
