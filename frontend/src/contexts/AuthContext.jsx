import { createContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../api';

// Create the authentication context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if we have tokens in localStorage
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verify the token
      const verifyResult = await authAPI.verifyToken();
      
      if (verifyResult.success) {
        // Token is valid, get user data
        const userResult = await userAPI.getCurrentUser();
        
        if (userResult.success) {
          setUser(userResult.data);
          setIsAuthenticated(true);
        } else {
          // User data fetch failed, clear tokens
          authAPI.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Token verification failed, try to refresh
        const refreshResult = await authAPI.refreshToken();
        
        if (refreshResult.success) {
          // Token refreshed successfully, get user data
          const userResult = await userAPI.getCurrentUser();
          
          if (userResult.success) {
            setUser(userResult.data);
            setIsAuthenticated(true);
          } else {
            authAPI.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Refresh failed, clear tokens
          authAPI.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await authAPI.login(username, password);
      
      if (result.success) {
        // Get user data after successful login
        const userResult = await userAPI.getCurrentUser();
        
        if (userResult.success) {
          setUser(userResult.data);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          setError('Failed to fetch user data');
          return { success: false, error: 'Failed to fetch user data' };
        }
      } else {
        setError(result.error);
        return result;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await authAPI.register(userData);
      
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return result;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };
      
      const result = await userAPI.updateUser(user.id, userData);
      
      if (result.success) {
        setUser(result.data);
        return { success: true };
      } else {
        setError(result.error);
        return result;
      }
    } catch (error) {
      console.error('Update user error:', error);
      setError('Failed to update user');
      return { success: false, error: 'Failed to update user' };
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 