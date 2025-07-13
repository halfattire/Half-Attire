// Quick Admin Authentication Diagnostic
// Copy and paste this into your browser console

(function() {
  console.log("🔍 === ADMIN AUTH DIAGNOSTIC ===");
  
  // Check localStorage tokens
  const userToken = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");
  
  console.log("📋 Authentication Status:");
  console.log("User token:", userToken ? "✅ Present" : "❌ Missing");
  console.log("User data:", userData ? "✅ Present" : "❌ Missing");
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("👤 User Details:");
      console.log("- ID:", user._id);
      console.log("- Email:", user.email);
      console.log("- Name:", user.name);
      console.log("- Role:", user.role);
      console.log("- Admin Check:", user.role && user.role.toLowerCase() === "admin" ? "✅ IS ADMIN" : "❌ NOT ADMIN");
      
      if (!user.role || user.role.toLowerCase() !== "admin") {
        console.error("🚫 User is not admin! Current role:", user.role);
        console.log("💡 Admin routes will fail. You need to login with an admin account.");
      }
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }
  
  // Test token validity
  if (userToken) {
    try {
      const parts = userToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp && payload.exp < now;
        
        console.log("🔐 Token Analysis:");
        console.log("- User ID in token:", payload.id || payload.userId);
        console.log("- Role in token:", payload.role);
        console.log("- Expires:", payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "No expiration");
        console.log("- Is expired:", isExpired ? "❌ YES" : "✅ NO");
        
        if (isExpired) {
          console.error("🚫 Token is expired! Please login again.");
        }
      }
    } catch (e) {
      console.error("❌ Error analyzing token:", e);
    }
  }
  
  console.log("\n🔧 Next Steps:");
  if (!userToken) {
    console.log("1. ❌ No user token - Please login first");
  } else if (!userData) {
    console.log("1. ❌ No user data - Authentication incomplete");
  } else {
    try {
      const user = JSON.parse(userData);
      if (!user.role || user.role.toLowerCase() !== "admin") {
        console.log("1. ❌ User is not admin - Login with admin account");
      } else {
        console.log("1. ✅ User is admin - Check backend response");
        console.log("2. 🔄 If still seeing 401 errors, token might be invalid");
        console.log("3. 🧪 Try running: window.testAdminAPICall() if available");
      }
    } catch (e) {
      console.log("1. ❌ Invalid user data format");
    }
  }
  
  console.log("========================");
})();
