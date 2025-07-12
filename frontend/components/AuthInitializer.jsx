"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserSuccess } from '../redux/reducers/user';

/**
 * Authentication initialization component
 * This component handles restoring authentication state from localStorage
 * It works better in production environments where SSR/hydration can cause issues
 */
export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeAuth = () => {
      try {
        // Check if we already have user data
        if (isAuthenticated && user) {
          setIsInitialized(true);
          return;
        }

        // Try to get user data from localStorage
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
          try {
            const parsedUserData = JSON.parse(userData);
            
            // Validate user data structure
            if (parsedUserData && parsedUserData._id && parsedUserData.email) {
              dispatch(loadUserSuccess(parsedUserData));
            } else {
              localStorage.removeItem('userData');
              localStorage.removeItem('token');
            }
          } catch (parseError) {
            console.error('Error parsing user data from localStorage:', parseError);
            // Clear corrupted data
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
          }
        } else {
          // No authentication data found
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setIsInitialized(true);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [dispatch, isAuthenticated, user]);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
