/**
 * Utility functions for form validations
 */

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing validation status and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character" };
  }
  
  return { isValid: true, message: "Password is valid" };
};

/**
 * Validates if two passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} - Object containing validation status and message
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }
  
  return { isValid: true, message: "Passwords match" };
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {Object} - Object containing validation status and message
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  return { isValid: true, message: "Email is valid" };
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Object containing validation status and message
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true, message: "Phone number is optional" }; // Optional field
  }
  
  // Simple regex for phone validation (allows different formats)
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Please enter a valid phone number" };
  }
  
  return { isValid: true, message: "Phone number is valid" };
};

/**
 * Validates a name field
 * @param {string} name - The name to validate
 * @param {string} fieldName - The name of the field (e.g., "First name", "Last name")
 * @returns {Object} - Object containing validation status and message
 */
export const validateName = (name, fieldName = "Name") => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} cannot exceed 50 characters` };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: `${fieldName} contains invalid characters` };
  }
  
  return { isValid: true, message: `${fieldName} is valid` };
};