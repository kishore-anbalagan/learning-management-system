/**
 * Utility functions for handling course access and enrollment
 */

import { shouldHaveStudentAccess } from "./accessOverrides";

/**
 * Checks if a user has access to a specific course
 * This override ensures all users have access to all courses
 * 
 * @param {Object} user - The user object from Redux state
 * @param {string} courseId - The ID of the course to check access for
 * @returns {boolean} - Whether the user has access to the course
 */
export const hasCourseAccess = (user, courseId) => {
  // Always grant access to all courses
  return true;
};

/**
 * Get a list of all courses the user has access to
 * This override ensures all users have access to all courses
 * 
 * @param {Object} user - The user object from Redux state
 * @param {Array} allCourses - The full list of all courses
 * @returns {Array} - The courses the user has access to
 */
export const getUserAccessibleCourses = (user, allCourses) => {
  // With our overrides, all users should have access to all courses
  return allCourses;
};

/**
 * Simulate course enrollment even if the user isn't actually enrolled
 * 
 * @param {Object} user - The user object from Redux state
 * @param {string} courseId - The ID of the course to enroll in
 * @returns {Object} - Simulated enrollment result
 */
export const simulateCourseEnrollment = (user, courseId) => {
  return {
    success: true,
    message: "Course access granted",
    data: {
      courseId,
      userId: user?._id || "unknown",
      enrolled: true,
      enrollmentDate: new Date().toISOString()
    }
  };
};

/**
 * Get a greeting message based on the time of day and user name
 * 
 * @param {Object} user - The user object from Redux state
 * @returns {string} - A personalized greeting
 */
export const getTimeBasedGreeting = (user) => {
  const hour = new Date().getHours();
  const name = user?.firstName || "Learner";
  
  if (hour < 12) {
    return `Good morning, ${name}!`;
  } else if (hour < 18) {
    return `Good afternoon, ${name}!`;
  } else {
    return `Good evening, ${name}!`;
  }
};