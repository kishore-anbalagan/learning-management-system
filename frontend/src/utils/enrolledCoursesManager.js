// Utility to manage enrolled courses with localStorage, supporting user-specific enrollments

// Helper to get the user-specific storage key
const getUserEnrollmentKey = (userId) => {
  return userId ? `enrolledCourses_${userId}` : 'enrolledCourses_guest';
};

// Get current user ID from localStorage or return null
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user._id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Get enrolled courses from localStorage for a specific user
export const getEnrolledCourses = (userId = null) => {
  try {
    // If userId is not provided, try to get it from localStorage
    const userIdToUse = userId || getCurrentUserId();
    const storageKey = getUserEnrollmentKey(userIdToUse);
    
    const enrolledCourses = localStorage.getItem(storageKey);
    
    if (!enrolledCourses) {
      return [];
    }
    
    try {
      // Parse stored data
      const parsedData = JSON.parse(enrolledCourses);
      
      // Data validation - ensure we always return an array
      if (Array.isArray(parsedData)) {
        return parsedData;
      } else {
        console.warn('Invalid enrolledCourses format in localStorage, resetting to empty array');
        localStorage.setItem(storageKey, JSON.stringify([]));
        return [];
      }
    } catch (parseError) {
      console.error('Error parsing enrolled courses data:', parseError);
      // Reset to empty array if data is corrupted
      localStorage.setItem(storageKey, JSON.stringify([]));
      return [];
    }
  } catch (error) {
    console.error('Error reading enrolled courses from localStorage:', error);
    return [];
  }
};

// Add a course to enrolled courses for a specific user
export const enrollInCourse = (courseObj, userId = null) => {
  try {
    // If userId is not provided, try to get it from localStorage
    const userIdToUse = userId || getCurrentUserId();
    const storageKey = getUserEnrollmentKey(userIdToUse);
    
    const enrolledCourses = getEnrolledCourses(userIdToUse);
    
    // Extract courseId regardless of whether we received an object or string
    const courseId = typeof courseObj === 'object' && courseObj !== null 
      ? courseObj._id 
      : courseObj;
    
    if (!courseId) {
      console.error('Invalid course data provided for enrollment');
      return false;
    }
    
    // Check if already enrolled (handle both object and string formats)
    const isEnrolled = enrolledCourses.some(course => {
      if (typeof course === 'object' && course !== null && course._id) {
        return course._id === courseId;
      }
      return course === courseId;
    });
    
    if (isEnrolled) {
      console.log(`User already enrolled in course ${courseId}`);
      return true; // Already enrolled is still a success state
    }
    
    // Add course to enrolled courses (store the full course object if provided)
    if (typeof courseObj === 'object' && courseObj !== null) {
      enrolledCourses.push(courseObj);
    } else {
      enrolledCourses.push(courseId);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(enrolledCourses));
    console.log(`Successfully enrolled in course ${courseId} in localStorage`);
    
    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
};

// Remove a course from enrolled courses for a specific user
export const unenrollFromCourse = (courseId, userId = null) => {
  try {
    // If userId is not provided, try to get it from localStorage
    const userIdToUse = userId || getCurrentUserId();
    const storageKey = getUserEnrollmentKey(userIdToUse);
    
    let enrolledCourses = getEnrolledCourses(userIdToUse);
    
    // Filter out the course to unenroll from
    // Handle both simple IDs and course objects
    enrolledCourses = enrolledCourses.filter(course => {
      // If the item is an object with _id property
      if (typeof course === 'object' && course !== null && course._id) {
        return course._id !== courseId;
      }
      // If the item is just a string ID
      return course !== courseId;
    });
    
    localStorage.setItem(storageKey, JSON.stringify(enrolledCourses));
    console.log(`Successfully unenrolled from course ${courseId} in localStorage`);
    
    return true;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return false;
  }
};

// Check if enrolled in a specific course for a specific user
export const isEnrolledInCourse = (courseId, userId = null) => {
  // If userId is not provided, try to get it from localStorage
  const userIdToUse = userId || getCurrentUserId();
  const enrolledCourses = getEnrolledCourses(userIdToUse);
  return enrolledCourses.includes(courseId);
};

// Clear all enrolled courses for a specific user
export const clearEnrolledCourses = (userId = null) => {
  try {
    const userIdToUse = userId || getCurrentUserId();
    const storageKey = getUserEnrollmentKey(userIdToUse);
    localStorage.removeItem(storageKey);
    console.log(`Cleared enrolled courses from localStorage for user ${userIdToUse}`);
    return true;
  } catch (error) {
    console.error('Error clearing enrolled courses:', error);
    return false;
  }
};