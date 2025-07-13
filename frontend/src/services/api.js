import axios from 'axios';

// ============================================================================
// 🚀 API CONFIGURATION
// ============================================================================
// This section sets up how our app talks to the backend server

// Create a configured axios instance (think of it as a pre-configured messenger)
const api = axios.create({
  // The address where our backend server is running
  baseURL: 'http://localhost:8000/api',
  
  // Tell the server we're sending JSON data
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// 🔐 AUTOMATIC TOKEN MANAGEMENT
// ============================================================================
// These functions automatically handle authentication tokens

// 🎯 REQUEST INTERCEPTOR - Adds auth token to every request
// This runs BEFORE we send any request to the server
api.interceptors.request.use(
  (config) => {
    // Get the user's access token from browser storage
    const token = localStorage.getItem('access_token');
    
    // If we have a token, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🎯 RESPONSE INTERCEPTOR - Handles token refresh and errors
// This runs AFTER we get a response from the server
api.interceptors.response.use(
  (response) => response, // If successful, just return the response
  
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 error (unauthorized) and haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've tried to refresh

      try {
        // Get the refresh token from browser storage
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // Try to get a new access token using the refresh token
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          // Save the new access token
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        // If refresh fails, clear all tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// 🔐 AUTHENTICATION API FUNCTIONS
// ============================================================================
// These functions handle user login, registration, and token management

export const authAPI = {
  // 🎯 LOGIN - Sign in with username and password
  login: async (username, password) => {
    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      
      // Extract tokens from the response
      const { access, refresh } = response.data;
      
      // Save tokens in browser storage for future use
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      return { success: true, data: response.data };
    } catch (error) {
      // If login fails, return error message
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  },

  // 🎯 REGISTER - Create a new user account
  register: async (userData) => {
    try {
      // Send registration request to the server
      const response = await api.post('/user/auth/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      // If registration fails, return error details
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed. Please try again.' 
      };
    }
  },

  // 🎯 VERIFY TOKEN - Check if current token is still valid
  verifyToken: async () => {
    try {
      // Get the current access token
      const token = localStorage.getItem('access_token');
      if (!token) return { success: false, error: 'No token found' };

      // Ask the server if our token is still good
      const response = await axios.post('http://localhost:8000/api/token/verify/', {
        token,
      });
      return { success: true, data: response.data };
    } catch {
      return { success: false, error: 'Token verification failed' };
    }
  },

  // 🎯 REFRESH TOKEN - Get a new access token using refresh token
  refreshToken: async () => {
    try {
      // Get the refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return { success: false, error: 'No refresh token found' };

      // Ask the server for a new access token
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      
      // Save the new access token
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      
      return { success: true, data: response.data };
    } catch {
      return { success: false, error: 'Token refresh failed' };
    }
  },

  // 🎯 LOGOUT - Clear all stored tokens and user data
  logout: () => {
    // Remove all authentication data from browser storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

// ============================================================================
// 👤 USER API FUNCTIONS
// ============================================================================
// These functions handle user profile management

export const userAPI = {
  // 🎯 GET ALL USERS - Get list of all users (admin only)
  getUsers: async () => {
    try {
      const response = await api.get('/user/auth/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch users' 
      };
    }
  },

  // 🎯 GET CURRENT USER - Get the logged-in user's profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user/auth/');
      const users = response.data;
      
      // Return the current user (assuming it's the first one for non-admin users)
      const currentUser = Array.isArray(users) ? users[0] : users;
      return { success: true, data: currentUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch user profile' 
      };
    }
  },

  // 🎯 UPDATE USER - Update the current user's profile
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/user/auth/${userId}/`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update user' 
      };
    }
  },
};

// ============================================================================
// 📚 CATEGORY API FUNCTIONS
// ============================================================================
// These functions handle course categories

export const categoryAPI = {
  // 🎯 GET ALL CATEGORIES - Get list of all course categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch categories' 
      };
    }
  },

  // 🎯 CREATE CATEGORY - Create a new category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories/', categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to create category' 
      };
    }
  },

  // 🎯 UPDATE CATEGORY - Update an existing category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/categories/${categoryId}/`, categoryData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update category' 
      };
    }
  },

  // 🎯 DELETE CATEGORY - Delete a category
  deleteCategory: async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}/`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to delete category' 
      };
    }
  },
};

// ============================================================================
// 📖 COURSE API FUNCTIONS
// ============================================================================
// These functions handle course management

export const courseAPI = {
  // 🎯 GET ALL COURSES - Get list of all courses
  getCourses: async () => {
    try {
      const response = await api.get('/courses/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch courses' 
      };
    }
  },

  // 🎯 GET SINGLE COURSE - Get details of a specific course
  getCourse: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch course' 
      };
    }
  },

  // 🎯 CREATE COURSE - Create a new course (teacher/admin only)
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses/', courseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to create course' 
      };
    }
  },

  // 🎯 UPDATE COURSE - Update an existing course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/courses/${courseId}/`, courseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update course' 
      };
    }
  },

  // 🎯 DELETE COURSE - Delete a course
  deleteCourse: async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}/`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to delete course' 
      };
    }
  },
};

// ============================================================================
// 📝 LESSON API FUNCTIONS
// ============================================================================
// These functions handle lesson management

export const lessonAPI = {
  // 🎯 GET ALL LESSONS - Get list of all lessons
  getLessons: async () => {
    try {
      const response = await api.get('/lessons/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch lessons' 
      };
    }
  },

  // 🎯 GET SINGLE LESSON - Get details of a specific lesson
  getLesson: async (lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch lesson' 
      };
    }
  },

  // 🎯 CREATE LESSON - Create a new lesson (teacher/admin only)
  createLesson: async (lessonData) => {
    try {
      const response = await api.post('/lessons/', lessonData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to create lesson' 
      };
    }
  },

  // 🎯 UPDATE LESSON - Update an existing lesson
  updateLesson: async (lessonId, lessonData) => {
    try {
      const response = await api.put(`/lessons/${lessonId}/`, lessonData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update lesson' 
      };
    }
  },

  // 🎯 DELETE LESSON - Delete a lesson
  deleteLesson: async (lessonId) => {
    try {
      await api.delete(`/lessons/${lessonId}/`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to delete lesson' 
      };
    }
  },
};

// ============================================================================
// 📁 FILE UPLOAD UTILITY
// ============================================================================
// This function handles file uploads to the server

export const uploadFile = async (file, endpoint) => {
  try {
    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Send file to the server
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || 'Failed to upload file' 
    };
  }
};

// ============================================================================
// 📋 EXPORT ALL API FUNCTIONS
// ============================================================================
// This makes all our API functions available to other parts of the app

export default {
  authAPI,
  userAPI,
  categoryAPI,
  courseAPI,
  lessonAPI,
  uploadFile,
}; 