/**
 * Enhanced utility for managing course enrollments with user-specific data
 */

// Helper function to safely interact with localStorage
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error accessing localStorage.getItem', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('Error accessing localStorage.setItem', e);
      return false;
    }
  }
};

// Get all enrolled courses for a specific user
export const getUserEnrolledCourses = (userId) => {
  try {
    if (!userId) {
      console.warn('No userId provided to getUserEnrolledCourses');
      return [];
    }
    
    // Each user has their own enrollment list stored in localStorage
    const storageKey = `user_${userId}_enrolledCourses`;
    const enrolledCourses = safeLocalStorage.getItem(storageKey);
    
    // Parse the JSON string safely
    try {
      return enrolledCourses ? JSON.parse(enrolledCourses) : [];
    } catch (parseError) {
      console.error('Error parsing enrolledCourses JSON:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error reading enrolled courses from localStorage:', error);
    return [];
  }
};

// Enroll a user in a specific course
export const enrollUserInCourse = (userId, courseId) => {
  try {
    if (!userId || !courseId) {
      console.warn('Missing userId or courseId in enrollUserInCourse');
      return { success: false, message: 'Missing user ID or course ID' };
    }
    
    const storageKey = `user_${userId}_enrolledCourses`;
    const enrolledCourses = getUserEnrolledCourses(userId);
    
    if (!Array.isArray(enrolledCourses)) {
      return { success: false, message: 'Failed to retrieve enrolled courses' };
    }
    
    // Check if already enrolled
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
      const stored = safeLocalStorage.setItem(storageKey, JSON.stringify(enrolledCourses));
      
      if (!stored) {
        return { success: false, message: 'Failed to store enrollment data' };
      }
      
      return { success: true, message: 'Successfully enrolled in course' };
    } else {
      return { success: false, message: 'Already enrolled in this course' };
    }
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return { success: false, message: 'Failed to enroll in course' };
  }
};

// Unenroll/cancel a user's enrollment in a specific course
export const unenrollUserFromCourse = (userId, courseId) => {
  try {
    if (!userId || !courseId) {
      console.warn('Missing userId or courseId in unenrollUserFromCourse');
      return { success: false, message: 'Missing user ID or course ID' };
    }
    
    const storageKey = `user_${userId}_enrolledCourses`;
    let enrolledCourses = getUserEnrolledCourses(userId);
    
    if (!Array.isArray(enrolledCourses)) {
      return { success: false, message: 'Failed to retrieve enrolled courses' };
    }
    
    // Check if enrolled
    if (enrolledCourses.includes(courseId)) {
      // Remove the course from enrolled courses
      enrolledCourses = enrolledCourses.filter(id => id !== courseId);
      const stored = safeLocalStorage.setItem(storageKey, JSON.stringify(enrolledCourses));
      
      if (!stored) {
        return { success: false, message: 'Failed to update enrollment data' };
      }
      
      // Also clean up any old non-user-specific enrollments
      try {
        // Legacy key that might have been used before
        const legacyKey = 'enrolledCourses';
        const legacyEnrollments = safeLocalStorage.getItem(legacyKey);
        
        if (legacyEnrollments) {
          const parsedEnrollments = JSON.parse(legacyEnrollments);
          if (Array.isArray(parsedEnrollments) && parsedEnrollments.includes(courseId)) {
            const updatedLegacyEnrollments = parsedEnrollments.filter(id => id !== courseId);
            safeLocalStorage.setItem(legacyKey, JSON.stringify(updatedLegacyEnrollments));
          }
        }
      } catch (e) {
        console.error('Error cleaning up legacy enrollments:', e);
      }
      
      return { success: true, message: 'Successfully unenrolled from course' };
    } else {
      return { success: false, message: 'Not enrolled in this course' };
    }
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return { success: false, message: 'Failed to unenroll from course' };
  }
};

// Check if a user is enrolled in a specific course
export const isUserEnrolledInCourse = (userId, courseId) => {
  try {
    if (!userId || !courseId) {
      console.warn('Missing userId or courseId in isUserEnrolledInCourse');
      return false;
    }
    
    const enrolledCourses = getUserEnrolledCourses(userId);
    console.log(`Checking if user ${userId} is enrolled in course ${courseId}`, enrolledCourses);
    
    return Array.isArray(enrolledCourses) && enrolledCourses.includes(courseId);
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    return false;
  }
};

// Get all courses with enrollment status for a user
export const getCoursesWithEnrollmentStatus = (userId, allCourses) => {
  try {
    if (!userId || !Array.isArray(allCourses)) {
      console.warn('Invalid parameters in getCoursesWithEnrollmentStatus', { userId, allCoursesType: typeof allCourses });
      return allCourses || [];
    }
    
    const enrolledCourseIds = getUserEnrolledCourses(userId);
    console.log('getCoursesWithEnrollmentStatus - enrolledCourseIds:', enrolledCourseIds);
    
    if (!Array.isArray(enrolledCourseIds)) {
      return allCourses.map(course => ({
        ...course,
        isEnrolled: false
      }));
    }
    
    return allCourses.map(course => ({
      ...course,
      isEnrolled: course && course._id && enrolledCourseIds.includes(course._id)
    }));
  } catch (error) {
    console.error('Error getting courses with enrollment status:', error);
    return allCourses || [];
  }
};

// Get only the courses a user is enrolled in
export const getOnlyEnrolledCourses = (userId, allCourses) => {
  try {
    if (!userId || !Array.isArray(allCourses)) {
      console.warn('Invalid parameters in getOnlyEnrolledCourses', { userId, allCoursesType: typeof allCourses });
      return [];
    }
    
    const enrolledCourseIds = getUserEnrolledCourses(userId);
    console.log('getOnlyEnrolledCourses - enrolledCourseIds:', enrolledCourseIds);
    
    if (!Array.isArray(enrolledCourseIds)) {
      return [];
    }
    
    const filteredCourses = allCourses.filter(course => 
      course && course._id && enrolledCourseIds.includes(course._id)
    );
    
    console.log(`Found ${filteredCourses.length} enrolled courses for user ${userId}`);
    return filteredCourses;
  } catch (error) {
    console.error('Error getting only enrolled courses:', error);
    return [];
  }
};