import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// This is the login page component
// It handles user login and shows a nice form
const LoginPage = () => {
  // State variables to store form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State to show loading spinner when logging in
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Get authentication functions from our context
  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  
  // React Router hook to navigate to other pages
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear any previous error messages when page loads
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Function to check if the form is valid
  const validateForm = () => {
    const newErrors = {};

    // Check if username is empty
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Check if password is empty or too short
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle input changes (when user types)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Function to handle form submission (when user clicks login)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page from refreshing
    
    // Check if form is valid before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true); // Show loading spinner
    
    try {
      // Try to log in with the provided credentials
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate('/dashboard'); // Go to dashboard if login successful
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false); // Hide loading spinner
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header with title and description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to your Learning Management System account
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Show error message if login failed */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {authError}
              </div>
            )}

            {/* Username input field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.username 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Enter your username"
                disabled={isSubmitting}
              />
              {errors.username && (
                <span className="text-red-500 text-xs mt-1 block">{errors.username}</span>
              )}
            </div>

            {/* Password input field with show/hide toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>
              )}
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer with link to registration */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                className="text-blue-600 hover:text-blue-800 font-semibold underline transition-colors disabled:opacity-50"
                onClick={() => navigate('/register')}
                disabled={isSubmitting}
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 