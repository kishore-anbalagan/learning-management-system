/**
 * Utility functions for handling authentication tokens
 */

/**
 * Safely retrieves and processes the auth token from localStorage
 * @returns {string|null} The processed token or null if not found
 */
export const getAuthToken = () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log("No token found in localStorage");
      return null;
    }
    
    // If token is a JSON string, parse it
    if (token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1); // Remove the quotes
    }
    
    // Try to parse if it might be a JSON object
    try {
      const parsedToken = JSON.parse(token);
      // If parsing worked and resulted in a string, return it
      if (typeof parsedToken === 'string') {
        return parsedToken;
      }
      // If parsing returned something else, return the original
      return token;
    } catch (e) {
      // If parsing failed, it's probably already a string
      return token;
    }
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return null;
  }
};

/**
 * Creates Authorization header with Bearer token
 * @returns {Object|null} Headers object or null if no token
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Get the current user from localStorage
 * @returns {Object|null} The user object or null if not found/invalid
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            return null;
        }
        return JSON.parse(userStr);
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

/**
 * Get the selected account type from localStorage
 * @returns {string|null} The account type or null if not found
 */
export const getSelectedAccountType = () => {
    try {
        return localStorage.getItem("selectedAccountType");
    } catch (error) {
        console.error("Error getting selected account type from localStorage:", error);
        return null;
    }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
    return !!getAuthToken() && !!getCurrentUser();
};