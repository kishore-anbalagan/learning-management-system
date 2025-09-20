import { apiConnector } from "../apiConnector";
import { dashboardEndpoints } from "../apis";

const {
  GET_STUDENT_DASHBOARD_API,
  GET_ENROLLED_COURSES_API,
  GET_COURSE_DETAILS_API,
  GET_COURSE_PROGRESS_API,
  MARK_LECTURE_COMPLETE_API,
  GET_INSTRUCTOR_DASHBOARD_API,
  GET_INSTRUCTOR_COURSES_API,
  GET_ENROLLED_STUDENTS_API,
  SEND_ENCOURAGEMENT_API,
} = dashboardEndpoints;

// Student Dashboard Services
export const getStudentDashboard = async (token) => {
  try {
    const response = await apiConnector("GET", GET_STUDENT_DASHBOARD_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_STUDENT_DASHBOARD_API ERROR", error);
    throw error;
  }
};

export const getEnrolledCourses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_ENROLLED_COURSES_API ERROR", error);
    throw error;
  }
};

export const getCourseDetails = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_COURSE_DETAILS_API}/${courseId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("GET_COURSE_DETAILS_API ERROR", error);
    throw error;
  }
};

export const getCourseProgress = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_COURSE_PROGRESS_API}/${courseId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("GET_COURSE_PROGRESS_API ERROR", error);
    throw error;
  }
};

export const markLectureComplete = async (courseId, subsectionId, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${MARK_LECTURE_COMPLETE_API}/${courseId}/${subsectionId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("MARK_LECTURE_COMPLETE_API ERROR", error);
    throw error;
  }
};

// Instructor Dashboard Services
export const getInstructorDashboard = async (token) => {
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DASHBOARD_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_INSTRUCTOR_DASHBOARD_API ERROR", error);
    throw error;
  }
};

export const getInstructorCourses = async (token) => {
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_INSTRUCTOR_COURSES_API ERROR", error);
    throw error;
  }
};

export const getEnrolledStudents = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_ENROLLED_STUDENTS_API}/${courseId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("GET_ENROLLED_STUDENTS_API ERROR", error);
    throw error;
  }
};

export const sendEncouragement = async (courseId, data, token) => {
  try {
    const response = await apiConnector(
      "POST",
      `${SEND_ENCOURAGEMENT_API}/${courseId}`,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("SEND_ENCOURAGEMENT_API ERROR", error);
    throw error;
  }
};