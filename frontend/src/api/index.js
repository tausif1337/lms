import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is also expired, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/user/auth/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return { success: false, error: 'No token found' };

      const response = await axios.post('http://localhost:8000/api/token/verify/', {
        token,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Token verification failed' };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return { success: false, error: 'No refresh token found' };

      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: refreshToken,
      });
      
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Token refresh failed' };
    }
  },

  // Logout (clear tokens)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

// User API
export const userAPI = {
  // Get current user or all users (admin only)
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

  // Get current user profile
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

  // Update user profile
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

// Category API
export const categoryAPI = {
  // Get all categories
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

  // Create category (admin only)
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

  // Update category (admin only)
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

  // Delete category (admin only)
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

// Course API
export const courseAPI = {
  // Get all courses (filtered by user role)
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

  // Get single course
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

  // Create course (teacher only)
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

  // Update course (teacher only)
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

  // Delete course (teacher only)
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

// Lesson API
export const lessonAPI = {
  // Get all lessons
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

  // Get lessons by course
  getLessonsByCourse: async (courseId) => {
    try {
      const response = await api.get(`/lessons/?course=${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch course lessons' 
      };
    }
  },

  // Create lesson
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

  // Update lesson
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

  // Delete lesson
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

// Material API
export const materialAPI = {
  // Get all materials
  getMaterials: async () => {
    try {
      const response = await api.get('/materials/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch materials' 
      };
    }
  },

  // Get materials by lesson
  getMaterialsByLesson: async (lessonId) => {
    try {
      const response = await api.get(`/materials/?lesson=${lessonId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch lesson materials' 
      };
    }
  },

  // Create material
  createMaterial: async (materialData) => {
    try {
      const response = await api.post('/materials/', materialData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to create material' 
      };
    }
  },

  // Update material
  updateMaterial: async (materialId, materialData) => {
    try {
      const response = await api.put(`/materials/${materialId}/`, materialData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update material' 
      };
    }
  },

  // Delete material
  deleteMaterial: async (materialId) => {
    try {
      await api.delete(`/materials/${materialId}/`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to delete material' 
      };
    }
  },
};

// Enrollment API
export const enrollmentAPI = {
  // Get all enrollments
  getEnrollments: async () => {
    try {
      const response = await api.get('/enrollments/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch enrollments' 
      };
    }
  },

  // Get enrollments by user
  getUserEnrollments: async (userId) => {
    try {
      const response = await api.get(`/enrollments/?student=${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch user enrollments' 
      };
    }
  },

  // Get enrollments by course
  getCourseEnrollments: async (courseId) => {
    try {
      const response = await api.get(`/enrollments/?course=${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch course enrollments' 
      };
    }
  },

  // Create enrollment
  createEnrollment: async (enrollmentData) => {
    try {
      const response = await api.post('/enrollments/', enrollmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to create enrollment' 
      };
    }
  },

  // Update enrollment
  updateEnrollment: async (enrollmentId, enrollmentData) => {
    try {
      const response = await api.put(`/enrollments/${enrollmentId}/`, enrollmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update enrollment' 
      };
    }
  },

  // Delete enrollment
  deleteEnrollment: async (enrollmentId) => {
    try {
      await api.delete(`/enrollments/${enrollmentId}/`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to delete enrollment' 
      };
    }
  },
};

// Question/Answer API
export const questionAnswerAPI = {
  // Get all questions
  getQuestions: async () => {
    try {
      const response = await api.get('/questions/');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch questions' 
      };
    }
  },

  // Get questions by course
  getQuestionsByCourse: async (courseId) => {
    try {
      const response = await api.get(`/questions/?course=${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to fetch course questions' 
      };
    }
  },

  // Create question
  createQuestion: async (questionData) => {
    try {
      const response = await api.post('/questions/', questionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to create question' 
      };
    }
  },

  // Update question
  updateQuestion: async (questionId, questionData) => {
    try {
      const response = await api.put(`/questions/${questionId}/`, questionData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to update question' 
      };
    }
  },

  // Delete question
  deleteQuestion: async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}/`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Failed to delete question' 
      };
    }
  },
};

// File upload helper
export const uploadFile = async (file, endpoint) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

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

// Export the main api instance for custom requests
export default api; 