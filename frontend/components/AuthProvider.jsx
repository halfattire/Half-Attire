"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserSuccess, logoutSuccess as userLogoutSuccess } from '../redux/reducers/user';
import { loadSellerSuccess, logoutSuccess as sellerLogoutSuccess } from '../redux/reducers/seller';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const [isInitialized, setIsInitialized] = useState(false);

  // Force logout - clears everything
  const forceLogout = () => {
    console.log("🔄 AuthProvider: Force logout initiated");
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('seller_token');
    localStorage.removeItem('sellerData');
    
    // Clear Redux state
    dispatch(userLogoutSuccess());
    dispatch(sellerLogoutSuccess());
    
    console.log("✅ AuthProvider: Force logout completed");
  };

  // Initialize authentication from localStorage
  const initializeAuth = () => {
    if (typeof window === 'undefined') return;

    try {
      console.log("🔄 AuthProvider: Initializing authentication...");
      
      // Check user authentication
      const userData = localStorage.getItem('userData');
      const userToken = localStorage.getItem('token');
      
      if (userData && userToken) {
        try {
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData?._id && parsedUserData?.email) {
            console.log("✅ AuthProvider: Restoring user authentication");
            dispatch(loadUserSuccess(parsedUserData));
          } else {
            console.log("❌ AuthProvider: Invalid user data, clearing...");
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("❌ AuthProvider: Error parsing user data:", error);
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
        }
      }
      
      // Check seller authentication
      const sellerData = localStorage.getItem('sellerData');
      const sellerToken = localStorage.getItem('seller_token');
      
      if (sellerData && sellerToken) {
        try {
          const parsedSellerData = JSON.parse(sellerData);
          if (parsedSellerData?._id && parsedSellerData?.email) {
            console.log("✅ AuthProvider: Restoring seller authentication");
            dispatch(loadSellerSuccess(parsedSellerData));
          } else {
            console.log("❌ AuthProvider: Invalid seller data, clearing...");
            localStorage.removeItem('sellerData');
            localStorage.removeItem('seller_token');
          }
        } catch (error) {
          console.error("❌ AuthProvider: Error parsing seller data:", error);
          localStorage.removeItem('sellerData');
          localStorage.removeItem('seller_token');
        }
      }
      
      setIsInitialized(true);
      console.log("✅ AuthProvider: Authentication initialization completed");
    } catch (error) {
      console.error("❌ AuthProvider: Initialization error:", error);
      setIsInitialized(true);
    }
  };

  // Initialize on mount
  useEffect(() => {
    const timer = setTimeout(initializeAuth, 50);
    return () => clearTimeout(timer);
  }, []);

  // Monitor localStorage changes (for multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userData' || e.key === 'token' || e.key === 'sellerData' || e.key === 'seller_token') {
        console.log("🔄 AuthProvider: Storage change detected, re-initializing...");
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue = {
    isAuthenticated: isAuthenticated && !!user,
    user,
    isSeller: isSeller && !!seller,
    seller,
    isInitialized,
    forceLogout,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
