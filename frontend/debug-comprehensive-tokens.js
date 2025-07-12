// Comprehensive Token Storage Debug Script
// Run this in your browser console after attempting login

window.debugTokenSystem = {
  
  // Test 1: Basic localStorage functionality
  testLocalStorage() {
    console.log("🔧 Testing basic localStorage functionality...");
    
    try {
      const testKey = "debug_test_" + Date.now();
      const testValue = "test_value_" + Math.random();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        console.log("✅ localStorage is working properly");
        return true;
      } else {
        console.log("❌ localStorage is NOT working - retrieved:", retrieved, "expected:", testValue);
        return false;
      }
    } catch (error) {
      console.error("❌ localStorage error:", error);
      return false;
    }
  },

  // Test 2: Check current authentication tokens
  checkCurrentTokens() {
    console.log("🔍 Checking current authentication state...");
    
    const userToken = localStorage.getItem("token");
    const sellerToken = localStorage.getItem("seller_token");
    const userData = localStorage.getItem("userData");
    const sellerData = localStorage.getItem("sellerData");
    
    console.log("User token:", userToken ? `Present (${userToken.length} chars, preview: ${userToken.substring(0, 30)}...)` : "❌ Missing");
    console.log("Seller token:", sellerToken ? `Present (${sellerToken.length} chars, preview: ${sellerToken.substring(0, 30)}...)` : "❌ Missing");
    console.log("User data:", userData ? "✅ Present" : "❌ Missing");
    console.log("Seller data:", sellerData ? "✅ Present" : "❌ Missing");
    
    // Try to parse user data
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("User data parsed successfully:", { name: parsedUser.name, email: parsedUser.email });
      } catch (e) {
        console.error("❌ User data parsing failed:", e);
      }
    }
    
    // Try to parse seller data
    if (sellerData) {
      try {
        const parsedSeller = JSON.parse(sellerData);
        console.log("Seller data parsed successfully:", { name: parsedSeller.name, email: parsedSeller.email });
      } catch (e) {
        console.error("❌ Seller data parsing failed:", e);
      }
    }
    
    return { userToken, sellerToken, userData, sellerData };
  },

  // Test 3: Simulate token storage (like login would do)
  simulateTokenStorage() {
    console.log("🔄 Simulating token storage...");
    
    const fakeUserToken = `fake_user_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fakeSellerToken = `fake_seller_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fakeUserData = {
      id: "test123",
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date().toISOString()
    };
    const fakeSellerData = {
      id: "shop123",
      name: "Test Shop",
      email: "shop@example.com",
      createdAt: new Date().toISOString()
    };
    
    try {
      localStorage.setItem("token", fakeUserToken);
      localStorage.setItem("seller_token", fakeSellerToken);
      localStorage.setItem("userData", JSON.stringify(fakeUserData));
      localStorage.setItem("sellerData", JSON.stringify(fakeSellerData));
      
      console.log("✅ Fake tokens stored successfully");
      
      // Immediately verify storage
      const storedUserToken = localStorage.getItem("token");
      const storedSellerToken = localStorage.getItem("seller_token");
      const storedUserData = localStorage.getItem("userData");
      const storedSellerData = localStorage.getItem("sellerData");
      
      console.log("Verification:");
      console.log("User token match:", storedUserToken === fakeUserToken ? "✅" : "❌");
      console.log("Seller token match:", storedSellerToken === fakeSellerToken ? "✅" : "❌");
      console.log("User data match:", storedUserData === JSON.stringify(fakeUserData) ? "✅" : "❌");
      console.log("Seller data match:", storedSellerData === JSON.stringify(fakeSellerData) ? "✅" : "❌");
      
      return true;
    } catch (error) {
      console.error("❌ Error during token storage simulation:", error);
      return false;
    }
  },

  // Test 4: Clear all authentication data
  clearAllTokens() {
    console.log("🗑️ Clearing all authentication data...");
    
    localStorage.removeItem("token");
    localStorage.removeItem("seller_token");
    localStorage.removeItem("userData");
    localStorage.removeItem("sellerData");
    
    console.log("✅ All tokens cleared");
    this.checkCurrentTokens();
  },

  // Test 5: Monitor localStorage changes
  monitorLocalStorage() {
    console.log("👀 Setting up localStorage monitoring...");
    
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
      if (key === 'token' || key === 'seller_token' || key === 'userData' || key === 'sellerData') {
        console.log(`🔔 localStorage.setItem called: ${key} = ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
      }
      return originalSetItem.apply(this, arguments);
    };
    
    localStorage.removeItem = function(key) {
      if (key === 'token' || key === 'seller_token' || key === 'userData' || key === 'sellerData') {
        console.log(`🔔 localStorage.removeItem called: ${key}`);
      }
      return originalRemoveItem.apply(this, arguments);
    };
    
    console.log("✅ localStorage monitoring active");
  },

  // Test 6: Check browser compatibility
  checkBrowserSupport() {
    console.log("🌐 Checking browser localStorage support...");
    
    if (typeof Storage !== "undefined") {
      console.log("✅ localStorage is supported");
      
      // Check quota
      try {
        const testSize = 1024 * 1024; // 1MB
        const testData = new Array(testSize).join('a');
        localStorage.setItem('quota_test', testData);
        localStorage.removeItem('quota_test');
        console.log("✅ localStorage has sufficient quota");
      } catch (e) {
        console.warn("⚠️ localStorage quota might be limited:", e);
      }
      
      return true;
    } else {
      console.error("❌ localStorage is not supported in this browser");
      return false;
    }
  },

  // Run all tests
  runAllTests() {
    console.log("🚀 Running comprehensive token storage tests...");
    console.log("================================");
    
    const results = {
      localStorage: this.testLocalStorage(),
      browserSupport: this.checkBrowserSupport(),
      currentTokens: this.checkCurrentTokens(),
      simulation: this.simulateTokenStorage()
    };
    
    console.log("================================");
    console.log("📊 Test Results Summary:");
    console.log("localStorage working:", results.localStorage ? "✅" : "❌");
    console.log("Browser support:", results.browserSupport ? "✅" : "❌");
    console.log("Simulation passed:", results.simulation ? "✅" : "❌");
    
    if (results.localStorage && results.browserSupport && results.simulation) {
      console.log("🎉 All tests passed! localStorage should be working properly.");
      console.log("💡 If you're still having issues, the problem might be in the login flow itself.");
    } else {
      console.log("❌ Some tests failed. localStorage might not be working properly.");
    }
    
    return results;
  }
};

// Initialize monitoring and show usage instructions
console.log("🔧 Token Storage Debug System Loaded");
console.log("📋 Available commands:");
console.log("  debugTokenSystem.runAllTests() - Run complete test suite");
console.log("  debugTokenSystem.checkCurrentTokens() - Check current authentication state");
console.log("  debugTokenSystem.simulateTokenStorage() - Test token storage functionality");
console.log("  debugTokenSystem.monitorLocalStorage() - Monitor localStorage calls");
console.log("  debugTokenSystem.clearAllTokens() - Clear all stored tokens");

// Auto-run basic check
debugTokenSystem.checkCurrentTokens();
