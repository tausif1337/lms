// ============================================================================
// 🛠️ HELPER FUNCTIONS
// ============================================================================
// This file contains useful functions that can be used throughout the app

// ============================================================================
// 📧 EMAIL VALIDATION
// ============================================================================

/**
 * 🎯 Validates if an email address is properly formatted
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 * 
 * Example usage:
 * const isValid = validateEmail('user@example.com'); // returns true
 * const isInvalid = validateEmail('invalid-email'); // returns false
 */
export const validateEmail = (email) => {
  // Regular expression to check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================================================
// 🔐 PASSWORD VALIDATION
// ============================================================================

/**
 * 🎯 Validates if a password meets security requirements
 * @param {string} password - The password to validate
 * @returns {object} - Object with isValid boolean and error message
 * 
 * Example usage:
 * const result = validatePassword('weak'); 
 * // returns { isValid: false, error: 'Password must be at least 6 characters' }
 */
export const validatePassword = (password) => {
  // Check if password exists
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  // Check minimum length
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  
  // Check if password contains at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one letter and one number' 
    };
  }
  
  return { isValid: true, error: null };
};

// ============================================================================
// 📱 PHONE NUMBER VALIDATION
// ============================================================================

/**
 * 🎯 Validates if a phone number is properly formatted
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if phone number is valid, false otherwise
 * 
 * Example usage:
 * const isValid = validatePhoneNumber('+1234567890'); // returns true
 * const isInvalid = validatePhoneNumber('invalid'); // returns false
 */
export const validatePhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters except + for international format
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it's a valid phone number (at least 10 digits)
  const digitCount = cleaned.replace(/[^\d]/g, '').length;
  return digitCount >= 10;
};

// ============================================================================
// 📝 TEXT VALIDATION
// ============================================================================

/**
 * 🎯 Validates if a text field is not empty and meets minimum length
 * @param {string} text - The text to validate
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {number} minLength - Minimum required length (default: 1)
 * @returns {object} - Object with isValid boolean and error message
 * 
 * Example usage:
 * const result = validateTextField('', 'Username', 3);
 * // returns { isValid: false, error: 'Username is required' }
 */
export const validateTextField = (text, fieldName, minLength = 1) => {
  // Check if text exists and is not just whitespace
  if (!text || !text.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  // Check minimum length
  if (text.trim().length < minLength) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least ${minLength} characters` 
    };
  }
  
  return { isValid: true, error: null };
};

// ============================================================================
// 📅 DATE AND TIME HELPERS
// ============================================================================

/**
 * 🎯 Formats a date into a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 * 
 * Example usage:
 * const formatted = formatDate('2024-01-15'); 
 * // returns "January 15, 2024"
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 🎯 Formats a date and time into a readable string
 * @param {string|Date} dateTime - The date and time to format
 * @returns {string} - Formatted date and time string
 * 
 * Example usage:
 * const formatted = formatDateTime('2024-01-15T10:30:00'); 
 * // returns "January 15, 2024 at 10:30 AM"
 */
export const formatDateTime = (dateTime) => {
  const dateObj = new Date(dateTime);
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * 🎯 Gets the time difference between now and a given date
 * @param {string|Date} date - The date to compare
 * @returns {string} - Human-readable time difference
 * 
 * Example usage:
 * const timeAgo = getTimeAgo('2024-01-15T10:30:00'); 
 * // returns "2 hours ago" or "3 days ago"
 */
export const getTimeAgo = (date) => {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInSeconds = Math.floor((now - pastDate) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// ============================================================================
// 💰 NUMBER FORMATTING
// ============================================================================

/**
 * 🎯 Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 * 
 * Example usage:
 * const formatted = formatCurrency(1234.56); 
 * // returns "$1,234.56"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * 🎯 Formats a number with commas for thousands
 * @param {number} number - The number to format
 * @returns {string} - Formatted number string
 * 
 * Example usage:
 * const formatted = formatNumber(1234567); 
 * // returns "1,234,567"
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};

// ============================================================================
// 📏 STRING MANIPULATION
// ============================================================================

/**
 * 🎯 Truncates text to a specified length and adds ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 * 
 * Example usage:
 * const truncated = truncateText('This is a very long text', 10); 
 * // returns "This is a..."
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

/**
 * 🎯 Capitalizes the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} - Text with first letter of each word capitalized
 * 
 * Example usage:
 * const capitalized = capitalizeWords('hello world'); 
 * // returns "Hello World"
 */
export const capitalizeWords = (text) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// ============================================================================
// 🔍 SEARCH AND FILTER HELPERS
// ============================================================================

/**
 * 🎯 Searches through an array of objects for a specific term
 * @param {Array} items - Array of objects to search through
 * @param {string} searchTerm - The term to search for
 * @param {Array} fields - Array of field names to search in
 * @returns {Array} - Filtered array of matching items
 * 
 * Example usage:
 * const users = [{ name: 'John', email: 'john@example.com' }];
 * const results = searchItems(users, 'john', ['name', 'email']);
 * // returns the user object if 'john' is found in name or email
 */
export const searchItems = (items, searchTerm, fields) => {
  if (!searchTerm) return items;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowerSearchTerm);
    });
  });
};

// ============================================================================
// 🎨 COLOR AND STYLING HELPERS
// ============================================================================

/**
 * 🎯 Generates a random color for user avatars or UI elements
 * @returns {string} - Hex color code
 * 
 * Example usage:
 * const color = generateRandomColor(); 
 * // returns "#ff6b6b" or similar
 */
export const generateRandomColor = () => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 🎯 Gets initials from a name for avatar display
 * @param {string} name - Full name
 * @returns {string} - Initials (e.g., "JD" for "John Doe")
 * 
 * Example usage:
 * const initials = getInitials('John Doe'); 
 * // returns "JD"
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * 🎯 Debounces a function to prevent excessive calls
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 * 
 * Example usage:
 * const debouncedSearch = debounce(searchFunction, 300);
 * // searchFunction will only run after 300ms of no calls
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * 🎯 Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful, false otherwise
 * 
 * Example usage:
 * const success = await copyToClipboard('Hello World');
 * if (success) console.log('Text copied!');
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * 🎯 Downloads a file from a URL
 * @param {string} url - URL of the file to download
 * @param {string} filename - Name for the downloaded file
 * 
 * Example usage:
 * downloadFile('https://example.com/file.pdf', 'document.pdf');
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ============================================================================
// 📋 EXPORT ALL HELPER FUNCTIONS
// ============================================================================

export default {
  // Validation functions
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateTextField,
  
  // Date and time functions
  formatDate,
  formatDateTime,
  getTimeAgo,
  
  // Number formatting functions
  formatCurrency,
  formatNumber,
  
  // String manipulation functions
  truncateText,
  capitalizeWords,
  
  // Search and filter functions
  searchItems,
  
  // Color and styling functions
  generateRandomColor,
  getInitials,
  
  // Utility functions
  debounce,
  copyToClipboard,
  downloadFile,
}; 