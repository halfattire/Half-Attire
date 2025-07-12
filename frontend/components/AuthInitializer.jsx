"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserSuccess } from '../redux/reducers/user';
import { loadSellerSuccess } from '../redux/reducers/seller';
import { getUserToken, getSellerToken } from '../lib/token-persistence';

/**
 * Authentication initialization component
 * This component handles restoring authentication state from localStorage
 * It works better in production environments where SSR/hydration can cause issues
 */
export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeAuth = () => {
      try {
        console.log("AuthInitializer: Starting authentication initialization...");
        
        // Initialize user authentication
        if (!isAuthenticated || !user) {
          const userData = localStorage.getItem('userData');
          const userToken = getUserToken();
          
          console.log("AuthInitializer: User token exists:", userToken ? "Yes" : "No");
          console.log("AuthInitializer: User data exists:", userData ? "Yes" : "No");
          
          if (userData && userToken) {
            try {
              const parsedUserData = JSON.parse(userData);
              
              // Validate user data structure
              if (parsedUserData && parsedUserData._id && parsedUserData.email) {
                console.log("AuthInitializer: Restoring user authentication for:", parsedUserData.email);
                dispatch(loadUserSuccess(parsedUserData));
              } else {
                console.log("AuthInitializer: Invalid user data structure, clearing...");
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
              }
            } catch (parseError) {
              console.error('Error parsing user data from localStorage:', parseError);
              // Clear corrupted data
              localStorage.removeItem('userData');
              localStorage.removeItem('token');
            }
          }
        } else {
          console.log("AuthInitializer: User already authenticated");
        }

        // Initialize seller authentication
        if (!isSeller || !seller) {
          const sellerData = localStorage.getItem('sellerData');
          const sellerToken = getSellerToken();
          
          console.log("AuthInitializer: Seller token exists:", sellerToken ? "Yes" : "No");
          console.log("AuthInitializer: Seller data exists:", sellerData ? "Yes" : "No");
          
          if (sellerData && sellerToken) {
            try {
              const parsedSellerData = JSON.parse(sellerData);
              
              // Validate seller data structure
              if (parsedSellerData && parsedSellerData._id && parsedSellerData.email) {
                console.log("AuthInitializer: Restoring seller authentication for:", parsedSellerData.email);
                dispatch(loadSellerSuccess(parsedSellerData));
              } else {
                console.log("AuthInitializer: Invalid seller data structure, clearing...");
                localStorage.removeItem('sellerData');
                localStorage.removeItem('seller_token');
              }
            } catch (parseError) {
              console.error('Error parsing seller data from localStorage:', parseError);
              // Clear corrupted data
              localStorage.removeItem('sellerData');
              localStorage.removeItem('seller_token');
            }
          }
        } else {
          console.log("AuthInitializer: Seller already authenticated");
        }

        console.log("AuthInitializer: Authentication initialization completed");
        setIsInitialized(true);
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setIsInitialized(true);
      }
    };

    // Small delay to ensure proper hydration
    const timer = setTimeout(initializeAuth, 100);

    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated, user, isSeller, seller]);

  // Always render children, authentication state will be managed in Redux
  return children;
}
