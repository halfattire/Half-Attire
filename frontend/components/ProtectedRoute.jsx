"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { loadUserSuccess } from "@/redux/reducers/user"
import { getAuthFromStorage, clearAuthFromStorage } from "@/lib/auth-persistence"
import Cookies from "js-cookie"

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      // Check if we're in the browser
      if (typeof window === 'undefined') return;
      
      // Try to get authentication data using the persistence service
      const authData = getAuthFromStorage();

      if (authData && !isAuthenticated) {
        // Load user data into Redux
        dispatch(loadUserSuccess(authData.userData));
        setIsInitialized(true);
        return;
      }

      // If no valid authentication data found and not already authenticated
      if (!isAuthenticated && !loading) {
        setIsInitialized(true);
        // Small delay to prevent immediate redirect on page load
        setTimeout(() => {
          router.push("/login");
        }, 500);
      } else {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isAuthenticated, loading, dispatch, router]);

  // Show loading while initializing
  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated after initialization, show nothing (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}