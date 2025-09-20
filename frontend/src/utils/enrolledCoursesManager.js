// Utility to manage enrolled courses with localStorage

// Get enrolled courses from localStorage
export const getEnrolledCourses = () => {
  try {
    const enrolledCourses = localStorage.getItem('enrolledCourses');
    return enrolledCourses ? JSON.parse(enrolledCourses) : [];
  } catch (error) {
    console.error('Error reading enrolled courses from localStorage:', error);
    return [];
  }
};

// Add a course to enrolled courses
export const enrollInCourse = (courseId) => {
  try {
    const enrolledCourses = getEnrolledCourses();
    
    // Check if already enrolled
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }
    
    return true;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return false;
  }
};

// Check if enrolled in a specific course
export const isEnrolledInCourse = (courseId) => {
  const enrolledCourses = getEnrolledCourses();
  return enrolledCourses.includes(courseId);
};