// Quick localStorage test utility
// Run this in the browser console to test localStorage functionality

function testLocalStorageBasic() {
  console.log("=== Basic localStorage Test ===");
  
  try {
    // Test basic localStorage functionality
    localStorage.setItem("test_key", "test_value");
    const retrieved = localStorage.getItem("test_key");
    console.log("Stored test_value, retrieved:", retrieved);
    
    if (retrieved === "test_value") {
      console.log("✅ localStorage is working!");
    } else {
      console.log("❌ localStorage is NOT working!");
    }
    
    // Clean up
    localStorage.removeItem("test_key");
    
    // Test with complex data
    const testData = { user: "test", id: 123 };
    localStorage.setItem("test_json", JSON.stringify(testData));
    const retrievedJson = JSON.parse(localStorage.getItem("test_json"));
    console.log("Stored JSON data:", testData);
    console.log("Retrieved JSON data:", retrievedJson);
    
    localStorage.removeItem("test_json");
    
  } catch (error) {
    console.error("❌ localStorage error:", error);
  }
}

function checkCurrentTokens() {
  console.log("=== Current Token Status ===");
  const userToken = localStorage.getItem("token");
  const sellerToken = localStorage.getItem("seller_token");
  const userData = localStorage.getItem("userData");
  const sellerData = localStorage.getItem("sellerData");
  
  console.log("User token exists:", userToken ? "Yes" : "No");
  console.log("Seller token exists:", sellerToken ? "Yes" : "No");
  console.log("User data exists:", userData ? "Yes" : "No");
  console.log("Seller data exists:", sellerData ? "Yes" : "No");
  
  if (userToken) {
    console.log("User token preview:", userToken.substring(0, 20) + "...");
  }
  if (sellerToken) {
    console.log("Seller token preview:", sellerToken.substring(0, 20) + "...");
  }
}

function forceTokenTest() {
  console.log("=== Force Token Storage Test ===");
  
  // Simulate storing tokens
  const fakeUserToken = "test_user_token_" + Date.now();
  const fakeSellerToken = "test_seller_token_" + Date.now();
  
  localStorage.setItem("token", fakeUserToken);
  localStorage.setItem("seller_token", fakeSellerToken);
  
  console.log("Stored fake user token:", fakeUserToken);
  console.log("Stored fake seller token:", fakeSellerToken);
  
  // Verify storage
  const retrievedUser = localStorage.getItem("token");
  const retrievedSeller = localStorage.getItem("seller_token");
  
  console.log("Retrieved user token:", retrievedUser);
  console.log("Retrieved seller token:", retrievedSeller);
  
  console.log("User token match:", retrievedUser === fakeUserToken ? "✅" : "❌");
  console.log("Seller token match:", retrievedSeller === fakeSellerToken ? "✅" : "❌");
  
  // Clean up test tokens (uncomment if you want to keep them for testing)
  // localStorage.removeItem("token");
  // localStorage.removeItem("seller_token");
}

// Auto-run basic test
if (typeof window !== 'undefined') {
  console.log("🔧 localStorage test utility loaded");
  console.log("Run testLocalStorageBasic(), checkCurrentTokens(), or forceTokenTest() in console");
}

// Export for module usage
if (typeof module !== 'undefined') {
  module.exports = { testLocalStorageBasic, checkCurrentTokens, forceTokenTest };
}
