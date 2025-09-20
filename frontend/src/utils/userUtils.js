/**
 * Utility functions for handling user roles and permissions
 */

/**
 * Determines if a user can access student dashboard features
 * @param {Object} user - The user object from Redux state
 * @returns {Boolean} - Whether the user should see student dashboard
 */
export const canAccessStudentDashboard = (user) => {
  // If no user is provided, return true (for development/demo)
  if (!user) return true;
  
  // In a real app, you would check user roles/permissions
  // For this demo, we'll allow all authenticated users to access student features
  return true;
};

/**
 * Gets the appropriate greeting based on time of day
 * @param {String} firstName - User's first name
 * @returns {String} - Personalized greeting
 */
export const getTimeBasedGreeting = (firstName) => {
  const hours = new Date().getHours();
  let greeting = '';
  
  if (hours < 12) {
    greeting = 'Good morning';
  } else if (hours < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  return `${greeting}, ${firstName || 'Student'}!`;
};

/**
 * Gets recommended courses based on user preferences and past activity
 * @param {Object} user - The user object
 * @param {Array} allCourses - Array of all available courses
 * @returns {Array} - Filtered and sorted list of recommended courses
 */
export const getRecommendedCourses = (user, allCourses) => {
  // In a real app, this would use user preferences, past courses, etc.
  // For this demo, we'll just return a shuffled subset of courses
  return [...allCourses].sort(() => 0.5 - Math.random()).slice(0, 3);
};