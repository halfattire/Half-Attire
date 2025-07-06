import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserSuccess } from '../redux/reducers/user';
import { getAuthFromStorage } from '../lib/auth-persistence';

/**
 * Custom hook for handling authentication state persistence
 * This ensures the user remains logged in across page refreshes
 */
export const useAuthPersistence = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window === 'undefined') return;

    const initializeAuth = async () => {
      try {
        // Get stored auth data
        const authData = getAuthFromStorage();
        
        if (authData && authData.userData && !isAuthenticated) {
          // Dispatch user data to Redux
          dispatch(loadUserSuccess(authData.userData));
          console.log('User authentication restored from localStorage');
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing authentication:', error);
        setIsInitialized(true);
      }
    };

    // Only initialize if not already authenticated and not loading
    if (!isAuthenticated && !loading) {
      initializeAuth();
    } else {
      setIsInitialized(true);
    }
  }, [isAuthenticated, loading, dispatch]);

  return {
    isAuthenticated,
    user,
    loading,
    isInitialized
  };
};

/**
 * Higher-order component for wrapping components that need authentication
 */
export const withAuthPersistence = (WrappedComponent) => {
  return function AuthPersistedComponent(props) {
    const { isAuthenticated, user, loading, isInitialized } = useAuthPersistence();

    // Show loading while initializing
    if (!isInitialized || loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} isAuthenticated={isAuthenticated} user={user} />;
  };
};
