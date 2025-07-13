// ============================================================================
// 🔐 AUTHENTICATION CONTEXT
// ============================================================================
// This file manages the authentication state for the entire app.
// It provides login, logout, and user management functions to all components.

// Import React hooks for state management and side effects
import { createContext, useState, useEffect } from 'react';

// Import our API functions for authentication and user management
import { authAPI, userAPI } from '../services/api';

// ============================================================================
// 🎯 CREATE AUTH CONTEXT
// ============================================================================
// This creates a React Context that will hold our authentication state.
// Think of it as a global storage that all components can access.

const AuthContext = createContext();

// ============================================================================
// 🔐 AUTH PROVIDER COMPONENT
// ============================================================================
// This component wraps our entire app and provides authentication
// functionality to all child components.

export const AuthProvider = ({ children }) => {
  // ============================================================================
  // 📊 STATE VARIABLES
  // ============================================================================
  // These variables hold the current state of our authentication system

  // Current user data (null if not logged in)
  const [user, setUser] = useState(null);
  
  // Whether the user is currently logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Whether we're currently loading (checking auth status, logging in, etc.)
  const [loading, setLoading] = useState(true);
  
  // Any error messages from authentication operations
  const [error, setError] = useState(null);

  // ============================================================================
  // 🔍 CHECK AUTHENTICATION STATUS ON APP START
  // ============================================================================
  // This runs when the app first loads to check if the user is already logged in

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ============================================================================
  // 🔍 CHECK AUTH STATUS FUNCTION
  // ============================================================================
  // This function checks if the user is currently authenticated by:
  // 1. Looking for stored tokens in the browser
  // 2. Verifying if those tokens are still valid
  // 3. Refreshing tokens if needed
  // 4. Loading user data if authentication is successful

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if we have authentication tokens stored in the browser
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      // If no tokens found, user is not logged in
      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Try to verify if our current token is still valid
      const verifyResult = await authAPI.verifyToken();
      
      if (verifyResult.success) {
        // Token is valid! Now get the user's data
        const userResult = await userAPI.getCurrentUser();
        
        if (userResult.success) {
          // Successfully loaded user data
          setUser(userResult.data);
          setIsAuthenticated(true);
        } else {
          // Failed to get user data, so clear everything
          authAPI.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Token verification failed, try to refresh it
        const refreshResult = await authAPI.refreshToken();
        
        if (refreshResult.success) {
          // Successfully refreshed token, now get user data
          const userResult = await userAPI.getCurrentUser();
          
          if (userResult.success) {
            setUser(userResult.data);
            setIsAuthenticated(true);
          } else {
            // Failed to get user data after refresh
            authAPI.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Refresh failed, user needs to log in again
          authAPI.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // If anything goes wrong, clear authentication
      authAPI.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // 🔑 LOGIN FUNCTION
  // ============================================================================
  // This function handles user login by:
  // 1. Sending username and password to the server
  // 2. Storing the returned tokens
  // 3. Loading the user's profile data
  // 4. Updating the authentication state

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Send login request to the server
      const result = await authAPI.login(username, password);
      
      if (result.success) {
        // Login successful! Now get the user's profile data
        const userResult = await userAPI.getCurrentUser();
        
        if (userResult.success) {
          // Successfully loaded user data
          setUser(userResult.data);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          // Login worked but couldn't get user data
          setError('Failed to fetch user data');
          return { success: false, error: 'Failed to fetch user data' };
        }
      } else {
        // Login failed
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

  // ============================================================================
  // 📝 REGISTER FUNCTION
  // ============================================================================
  // This function handles user registration by:
  // 1. Sending user data to the server
  // 2. Creating a new user account
  // 3. Returning success/error status

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Send registration request to the server
      const result = await authAPI.register(userData);
      
      if (result.success) {
        return { success: true };
      } else {
        // Registration failed
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

  // ============================================================================
  // 🚪 LOGOUT FUNCTION
  // ============================================================================
  // This function handles user logout by:
  // 1. Clearing stored tokens from the browser
  // 2. Resetting the authentication state
  // 3. Clearing any error messages

  const logout = () => {
    // Clear all authentication data from browser storage
    authAPI.logout();
    
    // Reset our state
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // ============================================================================
  // 🧹 CLEAR ERROR FUNCTION
  // ============================================================================
  // This function clears any error messages from the authentication state

  const clearError = () => {
    setError(null);
  };

  // ============================================================================
  // ✏️ UPDATE USER FUNCTION
  // ============================================================================
  // This function allows updating the current user's profile data

  const updateUser = async (userData) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };
      
      // Send update request to the server
      const result = await userAPI.updateUser(user.id, userData);
      
      if (result.success) {
        // Update successful, update our local state
        setUser(result.data);
        return { success: true };
      } else {
        // Update failed
        setError(result.error);
        return result;
      }
    } catch (error) {
      console.error('Update user error:', error);
      setError('Failed to update user');
      return { success: false, error: 'Failed to update user' };
    }
  };

  // ============================================================================
  // 📦 CONTEXT VALUE
  // ============================================================================
  // This object contains all the authentication functions and state
  // that we want to make available to other components

  const value = {
    // State variables
    user,                    // Current user data
    isAuthenticated,         // Whether user is logged in
    loading,                 // Whether we're loading
    error,                   // Any error messages
    
    // Functions
    login,                   // Function to log in
    register,                // Function to register
    logout,                  // Function to log out
    clearError,              // Function to clear errors
    updateUser,              // Function to update user profile
    checkAuthStatus,         // Function to check auth status
  };

  // ============================================================================
  // 🎯 RENDER AUTH PROVIDER
  // ============================================================================
  // Return the context provider with our authentication value
  // This makes all the auth functions and state available to child components

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================================
// 📋 EXPORT CONTEXT
// ============================================================================
// Export the context so other components can use it

export default AuthContext;

// ============================================================================
// 🎯 HOW TO USE THIS CONTEXT
// ============================================================================
// 
// In any component, you can access authentication like this:
// 
// import { useAuth } from '../hooks/useAuth';
// 
// function MyComponent() {
//   const { user, isAuthenticated, login, logout } = useAuth();
//   
//   if (isAuthenticated) {
//     return <div>Welcome, {user.username}!</div>;
//   } else {
//     return <button onClick={() => login('user', 'pass')}>Log In</button>;
//   }
// }
//
// ============================================================================
// 🔍 WHAT HAPPENS WHEN THE APP STARTS
// ============================================================================
// 
// 1. AuthProvider component is created
// 2. checkAuthStatus() runs automatically
// 3. It looks for stored tokens in the browser
// 4. If tokens exist, it verifies they're still valid
// 5. If valid, it loads the user's profile data
// 6. If invalid, it tries to refresh the tokens
// 7. If refresh fails, user needs to log in again
// 8. Authentication state is set accordingly
//
// ============================================================================
// 🛡️ SECURITY FEATURES
// ============================================================================
// 
// - Tokens are automatically refreshed when they expire
// - Failed authentication attempts clear all stored data
// - Error handling prevents app crashes
// - Loading states provide good user experience
// - All API calls include proper error handling 