// Token Storage Debug Utility
// Run this in browser console to check localStorage token storage

window.debugTokenStorage = function() {
  console.log("=== Token Storage Debug ===");
  
  // Check localStorage contents
  console.log("localStorage contents:");
  console.log("- token:", localStorage.getItem("token"));
  console.log("- seller_token:", localStorage.getItem("seller_token"));
  console.log("- userData:", localStorage.getItem("userData"));
  console.log("- sellerData:", localStorage.getItem("sellerData"));
  
  // Check if storage is working
  try {
    const testKey = "test_storage_" + Date.now();
    const testValue = "test_value";
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    console.log("localStorage test:", retrieved === testValue ? "WORKING" : "FAILED");
  } catch (error) {
    console.error("localStorage test failed:", error);
  }
  
  // Force store tokens for testing
  window.forceStoreTokens = function() {
    const dummyToken = "test_token_" + Date.now();
    const dummySellerToken = "test_seller_token_" + Date.now();
    
    localStorage.setItem("token", dummyToken);
    localStorage.setItem("seller_token", dummySellerToken);
    localStorage.setItem("userData", JSON.stringify({_id: "test", email: "test@test.com"}));
    localStorage.setItem("sellerData", JSON.stringify({_id: "test", email: "seller@test.com"}));
    
    console.log("Force stored test tokens");
    window.debugTokenStorage();
  };
  
  console.log("Run window.forceStoreTokens() to test manual storage");
  console.log("========================");
};

// Auto-run debug on page load
if (typeof window !== 'undefined') {
  window.debugTokenStorage();
}
