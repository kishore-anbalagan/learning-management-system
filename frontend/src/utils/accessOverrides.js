/**
 * This file contains utility functions to override user access controls
 * and ensure all users can access student dashboard features
 */

import { ACCOUNT_TYPE } from './constants';
import { getUserEnrolledCourses } from './userCourseManager';

/**
 * Override for the user account type check
 * This ensures that regardless of the actual account type,
 * all users will have access to student features
 * 
 * @param {Object} user - The user object from Redux state
 * @returns {Object} - Modified user object with additional access
 */
export const getEnhancedUser = (user) => {
  if (!user) return null;
  
  // Create a deep copy of the user to avoid modifying the original
  const enhancedUser = JSON.parse(JSON.stringify(user));
  
  // Add a flag to indicate the user has student access
  enhancedUser.hasStudentAccess = true;
  
  return enhancedUser;
};

/**
 * Checks if the current path is a student-specific path
 * 
 * @param {string} path - The current path
 * @returns {boolean} - Whether the path is student-specific
 */
export const isStudentPath = (path) => {
  const studentPaths = [
    '/dashboard/enrolled-courses',
    '/dashboard/course-catalog',
    '/view-course',  // Course viewing pages
    '/enrolled-course' // Any enrolled course pages
  ];
  
  return studentPaths.some(studentPath => path.includes(studentPath));
};

/**
 * Check if a given path should bypass role-based restrictions
 * 
 * @param {string} path - The current path
 * @returns {boolean} - Whether access should be granted regardless of role
 */
export const shouldBypassRoleCheck = (path) => {
  // All dashboard paths should bypass role checks
  if (path.startsWith('/dashboard/')) {
    return true;
  }
  
  // Course-related paths should bypass role checks
  if (isStudentPath(path)) {
    return true;
  }
  
  return false;
};

/**
 * Override function to check if a user should have access to student features
 * This will always return true to ensure all users have access
 * 
 * @param {Object} user - The user object from Redux state
 * @returns {boolean} - Whether the user should have access (always true)
 */
export const shouldHaveStudentAccess = (user) => {
  return true;
};

/**
 * Get all links that should be available to all users
 * This combines both student and instructor links
 * 
 * @param {Object} user - The user object from Redux state
 * @returns {Array} - Array of sidebar link objects
 */
export const getAllDashboardLinks = (user) => {
  const commonLinks = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard/home",
      icon: "VscHome",
    },
    {
      id: 2,
      name: "My Profile",
      path: "/dashboard/my-profile",
      icon: "VscAccount",
    },
    {
      id: 6,
      name: "Settings",
      path: "/dashboard/settings",
      icon: "VscAccount",
    }
  ];
  
  const studentLinks = [
    {
      id: 3,
      name: "Enrolled Courses",
      path: "/dashboard/enrolled-courses",
      icon: "VscMortarBoard",
    },
    {
      id: 4,
      name: "Course Catalog",
      path: "/dashboard/course-catalog",
      icon: "VscBook",
    }
  ];
  
  const instructorLinks = [
    {
      id: 7,
      name: "My Courses",
      path: "/dashboard/my-courses",
      icon: "VscBook",
    },
    {
      id: 8,
      name: "Add Course",
      path: "/dashboard/add-course",
      icon: "VscAdd",
    },
    {
      id: 9,
      name: "Enrolled Students",
      path: "/dashboard/enrolled-students",
      icon: "VscPerson",
    }
  ];
  
  // Combine all links
  return [...commonLinks, ...studentLinks, 
    ...(user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? instructorLinks : [])];
};

/**
 * Check if a user is enrolled in a specific course
 * Uses the userCourseManager utility to check user-specific enrollments
 * 
 * @param {string} userId - The user ID
 * @param {string} courseId - The course ID to check
 * @returns {boolean} - Whether the user is enrolled in the course
 */
export const isUserEnrolledInCourse = (userId, courseId) => {
  if (!userId || !courseId) return false;
  
  try {
    const enrolledCourses = getUserEnrolledCourses(userId);
    return Array.isArray(enrolledCourses) && enrolledCourses.includes(courseId);
  } catch (error) {
    console.error('Error checking course enrollment:', error);
    return false;
  }
};

/**
 * Check if a user should have access to view a specific course
 * This respects user-specific enrollments
 * 
 * @param {Object} user - The user object from Redux state
 * @param {string} courseId - The course ID to check
 * @returns {boolean} - Whether the user should have access to the course
 */
export const shouldHaveCourseAccess = (user, courseId) => {
  if (!user || !courseId) return false;
  
  // Instructors always have access to all courses
  if (user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
    return true;
  }
  
  // For students and other account types, check enrollment
  return isUserEnrolledInCourse(user._id, courseId);
};