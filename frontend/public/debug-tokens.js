// Enhanced Token Storage Debug Utility
// Run this in browser console to diagnose token issues

window.debugTokenStorage = function() {
  console.log("=== ENHANCED Token Storage Debug ===");
  
  // Check localStorage contents
  console.log("📋 localStorage contents:");
  const token = localStorage.getItem("token");
  const sellerToken = localStorage.getItem("seller_token");
  const userData = localStorage.getItem("userData");
  const sellerData = localStorage.getItem("sellerData");
  
  console.log("- token:", token ? `Present (${token.length} chars): ${token.substring(0, 30)}...` : "❌ MISSING");
  console.log("- seller_token:", sellerToken ? `Present (${sellerToken.length} chars): ${sellerToken.substring(0, 30)}...` : "❌ MISSING");
  console.log("- userData:", userData ? "✅ Present" : "❌ MISSING");
  console.log("- sellerData:", sellerData ? "✅ Present" : "❌ MISSING");
  
  // Parse and validate data
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      console.log("👤 User data:", { id: parsed._id, email: parsed.email, role: parsed.role });
    } catch (e) {
      console.error("❌ User data parse error:", e);
    }
  }
  
  if (sellerData) {
    try {
      const parsed = JSON.parse(sellerData);
      console.log("🏪 Seller data:", { id: parsed._id, email: parsed.email, name: parsed.name });
    } catch (e) {
      console.error("❌ Seller data parse error:", e);
    }
  }
  
  // Check if storage is working
  try {
    const testKey = "test_storage_" + Date.now();
    const testValue = "test_value";
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    console.log("🔧 localStorage test:", retrieved === testValue ? "✅ WORKING" : "❌ FAILED");
  } catch (error) {
    console.error("❌ localStorage test failed:", error);
  }
  
  // Test axios headers
  window.testAxiosHeaders = function() {
    console.log("🔍 Testing axios header attachment...");
    
    // Simulate admin request
    const adminConfig = { url: '/api/order/admin-all-orders' };
    const shopConfig = { url: '/api/shop/get-shop-info' };
    
    console.log("Admin request would use token:", token ? "✅ User token" : "❌ No token");
    console.log("Shop request would use token:", sellerToken ? "✅ Seller token" : "❌ No token");
  };
  
  // Force store tokens for testing
  window.forceStoreTokens = function() {
    const dummyToken = "test_user_token_" + Date.now();
    const dummySellerToken = "test_seller_token_" + Date.now();
    
    localStorage.setItem("token", dummyToken);
    localStorage.setItem("seller_token", dummySellerToken);
    localStorage.setItem("userData", JSON.stringify({
      _id: "test_user_123",
      email: "admin@test.com",
      role: "Admin",
      name: "Test Admin"
    }));
    localStorage.setItem("sellerData", JSON.stringify({
      _id: "test_seller_123",
      email: "seller@test.com",
      name: "Test Shop"
    }));
    
    console.log("✅ Force stored test tokens");
    window.debugTokenStorage();
  };
  
  console.log("🔧 Available commands:");
  console.log("- window.forceStoreTokens() - Store test tokens");
  console.log("- window.testAxiosHeaders() - Test axios configuration");
  console.log("========================");
};

// Auto-run debug on page load
if (typeof window !== 'undefined') {
  window.debugTokenStorage();
}
