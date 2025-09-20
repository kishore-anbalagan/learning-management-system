/**
 * Test utilities for verifying the role access overrides
 */

import { shouldHaveStudentAccess, shouldBypassRoleCheck, isStudentPath } from './accessOverrides';
import { hasCourseAccess, getUserAccessibleCourses } from './courseAccessUtils';

/**
 * Test if the role bypass system is working correctly
 * 
 * @returns {Object} - Test results
 */
export const testRoleBypassSystem = () => {
  const results = {
    accessOverrides: testAccessOverrides(),
    courseAccess: testCourseAccess(),
    pathChecks: testPathChecks()
  };
  
  return {
    allTestsPassed: 
      results.accessOverrides.passed && 
      results.courseAccess.passed && 
      results.pathChecks.passed,
    results
  };
};

/**
 * Test the access override utilities
 * 
 * @returns {Object} - Test results
 */
const testAccessOverrides = () => {
  // Create test users with different roles
  const studentUser = { accountType: 'Student' };
  const instructorUser = { accountType: 'Instructor' };
  const adminUser = { accountType: 'Admin' };
  const nullUser = null;
  
  // Test shouldHaveStudentAccess function
  const studentAccessTests = [
    shouldHaveStudentAccess(studentUser) === true,
    shouldHaveStudentAccess(instructorUser) === true,
    shouldHaveStudentAccess(adminUser) === true,
    shouldHaveStudentAccess(nullUser) === true
  ];
  
  return {
    passed: studentAccessTests.every(result => result === true),
    details: {
      shouldHaveStudentAccess: studentAccessTests.every(result => result === true)
    }
  };
};

/**
 * Test the course access utilities
 * 
 * @returns {Object} - Test results
 */
const testCourseAccess = () => {
  // Create test users and courses
  const studentUser = { accountType: 'Student' };
  const instructorUser = { accountType: 'Instructor' };
  const courseId = '123';
  const allCourses = [{ id: '123' }, { id: '456' }];
  
  // Test hasCourseAccess function
  const courseAccessTests = [
    hasCourseAccess(studentUser, courseId) === true,
    hasCourseAccess(instructorUser, courseId) === true,
    hasCourseAccess(null, courseId) === true
  ];
  
  // Test getUserAccessibleCourses function
  const accessibleCoursesTests = [
    getUserAccessibleCourses(studentUser, allCourses).length === allCourses.length,
    getUserAccessibleCourses(instructorUser, allCourses).length === allCourses.length,
    getUserAccessibleCourses(null, allCourses).length === allCourses.length
  ];
  
  return {
    passed: 
      courseAccessTests.every(result => result === true) &&
      accessibleCoursesTests.every(result => result === true),
    details: {
      hasCourseAccess: courseAccessTests.every(result => result === true),
      getUserAccessibleCourses: accessibleCoursesTests.every(result => result === true)
    }
  };
};

/**
 * Test the path checking utilities
 * 
 * @returns {Object} - Test results
 */
const testPathChecks = () => {
  // Test paths
  const studentPaths = [
    '/dashboard/enrolled-courses',
    '/dashboard/course-catalog',
    '/view-course/123',
    '/enrolled-course/456'
  ];
  
  const nonStudentPaths = [
    '/dashboard/my-profile',
    '/dashboard/settings',
    '/',
    '/about'
  ];
  
  // Test isStudentPath function
  const studentPathTests = studentPaths.map(path => isStudentPath(path) === true);
  const nonStudentPathTests = nonStudentPaths.map(path => isStudentPath(path) === false);
  
  // Test shouldBypassRoleCheck function
  const bypassTests = [
    ...studentPaths.map(path => shouldBypassRoleCheck(path) === true),
    ...nonStudentPaths.filter(path => path.startsWith('/dashboard/')).map(path => shouldBypassRoleCheck(path) === true),
    ...nonStudentPaths.filter(path => !path.startsWith('/dashboard/')).map(path => shouldBypassRoleCheck(path) === false)
  ];
  
  return {
    passed: 
      studentPathTests.every(result => result === true) &&
      nonStudentPathTests.every(result => result === true) &&
      bypassTests.every(result => result === true),
    details: {
      isStudentPath: {
        studentPaths: studentPathTests.every(result => result === true),
        nonStudentPaths: nonStudentPathTests.every(result => result === true)
      },
      shouldBypassRoleCheck: bypassTests.every(result => result === true)
    }
  };
};