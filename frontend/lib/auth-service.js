import axios from "axios";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { server } from "@/lib/server";
import { toast } from "react-toastify";

/**
 * Handle Google Sign In and authenticate with backend
 */
export const handleGoogleSignIn = async () => {
  try {
    // 1. Authenticate with Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();

    // 2. Send Firebase token to our backend to verify and create/authenticate user
    const response = await axios.post(
      `${server}/user/google`,
      {
        name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email,
        photo: user.photoURL || "/assets/user.png",
        uid: user.uid,
        idToken: idToken, // Send Firebase token for verification
      },
      { withCredentials: true } // Important: allow cookies to be set
    );

    // 3. If successful, our backend will set the JWT cookie
    if (response.data.success) {
      // Store minimal user data in localStorage for UI purposes
      const userData = response.data.user;
      localStorage.setItem("userData", JSON.stringify(userData));

      toast.success("Successfully signed in with Google!");
      return { success: true, user: userData };
    } else {
      throw new Error(response.data.message || "Authentication failed");
    }
  } catch (error) {
    console.error("Google auth error:", error);
    if (error.code === "auth/popup-closed-by-user") {
      toast.info("Sign-in cancelled");
    } else {
      toast.error(error.response?.data?.message || "Google sign-in failed");
    }
    return { success: false, error };
  }
};

/**
 * Complete logout - clears both Firebase and backend authentication
 */
export const logoutUser = async () => {
  try {
    console.log("Starting logout process...");

    // 1. Sign out from Firebase first
    await signOut(auth);
    console.log("Firebase signout successful");

    // 2. Sign out from backend (clear cookies)
    try {
      await axios.get(`${server}/user/logout`, { withCredentials: true });
      console.log("Backend logout successful");
    } catch (backendError) {
      console.warn("Backend logout failed, but continuing:", backendError.message);
      // Continue even if backend logout fails
    }

    // 3. Clear all local storage
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");

    // Clear any other auth-related items
    localStorage.clear();

    console.log("Logout completed successfully");
    toast.success("Logged out successfully");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, clear local storage
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedPassword");

    toast.error("Logout completed with some issues");
    return { success: false, error };
  }
};

/**
 * Check authentication status
 */
export const checkAuthStatus = () => {
  const userData = localStorage.getItem("userData");
  const firebaseUser = auth.currentUser;

  console.log("Auth status check:");
  console.log("- localStorage userData:", userData ? "Present" : "Missing");
  console.log("- Firebase user:", firebaseUser ? "Present" : "Missing");

  return {
    hasLocalData: !!userData,
    hasFirebaseUser: !!firebaseUser,
    userData: userData ? JSON.parse(userData) : null,
  };
};