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
        // Initialize user authentication
        if (!isAuthenticated || !user) {
          const userData = localStorage.getItem('userData');
          const userToken = getUserToken();
          
          if (userData && userToken) {
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
          }
        }

        // Initialize seller authentication
        if (!isSeller || !seller) {
          const sellerData = localStorage.getItem('sellerData');
          const sellerToken = getSellerToken();
          
          if (sellerData && sellerToken) {
            try {
              const parsedSellerData = JSON.parse(sellerData);
              
              // Validate seller data structure
              if (parsedSellerData && parsedSellerData._id && parsedSellerData.email) {
                dispatch(loadSellerSuccess(parsedSellerData));
              } else {
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
        }

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
