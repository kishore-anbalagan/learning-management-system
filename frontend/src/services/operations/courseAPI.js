// Adjusted paths: apiConnector and apis are located one level up (src/services)
import { apiConnector } from '../apiConnector';
import { courseEndpoints } from '../apis';

const {
  GET_ALL_COURSES_API,
  GET_COURSE_DETAILS_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  DELETE_COURSE_API,
  INSTRUCTOR_COURSES_API,
  GET_ENROLLED_COURSES_API,
  ENROLL_IN_COURSE_API,
  GET_COURSE_CONTENT_API,
  MARK_SUBSECTION_COMPLETE_API,
  GET_COURSE_STUDENTS_API,
  SEND_COURSE_ENCOURAGEMENT_API,
  GET_COURSE_PROGRESS_API,
  UPDATE_COURSE_PROGRESS_API
} = courseEndpoints;

// Get all courses (public)
export const getAllCourses = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_COURSES_API);
    return response.data;
  } catch (error) {
    console.error("GET_ALL_COURSES_API API ERROR...", error);
    throw error;
  }
};

// Get course details (public)
export const getCourseDetails = async (courseId) => {
  try {
    const response = await apiConnector("GET", `${GET_COURSE_DETAILS_API}/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("GET_COURSE_DETAILS_API API ERROR...", error);
    throw error;
  }
};

// Create a new course (instructor only)
export const createCourse = async (data, token) => {
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("CREATE_COURSE_API API ERROR...", error);
    throw error;
  }
};

// Edit a course (instructor only)
export const editCourse = async (courseId, data, token) => {
  try {
    const response = await apiConnector("PUT", `${EDIT_COURSE_API}/${courseId}`, data, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("EDIT_COURSE_API API ERROR...", error);
    throw error;
  }
};

// Delete a course (instructor only)
export const deleteCourse = async (courseId, token) => {
  try {
    const response = await apiConnector("DELETE", `${DELETE_COURSE_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("DELETE_COURSE_API API ERROR...", error);
    throw error;
  }
};

// Get all courses created by instructor (instructor only)
export const getInstructorCourses = async (token) => {
  try {
    const response = await apiConnector("GET", INSTRUCTOR_COURSES_API, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("INSTRUCTOR_COURSES_API API ERROR...", error);
    throw error;
  }
};

// Get all enrolled courses (student only)
export const getEnrolledCourses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("GET_ENROLLED_COURSES_API API ERROR...", error);
    throw error;
  }
};

// Enroll in a course (student only)
export const enrollInCourse = async (courseId, token) => {
  try {
    const response = await apiConnector("POST", `${ENROLL_IN_COURSE_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("ENROLL_IN_COURSE_API API ERROR...", error);
    throw error;
  }
};

// Get course content (enrolled students only)
export const getCourseContent = async (courseId, token) => {
  try {
    const response = await apiConnector("GET", `${GET_COURSE_CONTENT_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("GET_COURSE_CONTENT_API API ERROR...", error);
    throw error;
  }
};

// Mark a subsection as complete (student only)
export const markSubSectionAsComplete = async (courseId, subsectionId, token) => {
  try {
    const response = await apiConnector("POST", `${MARK_SUBSECTION_COMPLETE_API}/${courseId}/${subsectionId}`, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("MARK_SUBSECTION_COMPLETE_API API ERROR...", error);
    throw error;
  }
};

// Get students enrolled in a course (instructor only)
export const getCourseStudents = async (courseId, token) => {
  try {
    const response = await apiConnector("GET", `${GET_COURSE_STUDENTS_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("GET_COURSE_STUDENTS_API API ERROR...", error);
    throw error;
  }
};

// Send encouragement message to students (instructor only)
export const sendCourseEncouragement = async (courseId, data, token) => {
  try {
    const response = await apiConnector("POST", `${SEND_COURSE_ENCOURAGEMENT_API}/${courseId}`, data, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("SEND_COURSE_ENCOURAGEMENT_API API ERROR...", error);
    throw error;
  }
};

// Get course progress (student only)
export const getCourseProgress = async (courseId, token) => {
  try {
    const response = await apiConnector("GET", `${GET_COURSE_PROGRESS_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("GET_COURSE_PROGRESS_API API ERROR...", error);
    throw error;
  }
};

// Update course progress (student only)
export const updateCourseProgress = async (courseId, data, token) => {
  try {
    const response = await apiConnector("PUT", `${UPDATE_COURSE_PROGRESS_API}/${courseId}`, data, {
      Authorization: `Bearer ${token}`
    });
    return response.data;
  } catch (error) {
    console.error("UPDATE_COURSE_PROGRESS_API API ERROR...", error);
    throw error;
  }
};