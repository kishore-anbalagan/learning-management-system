import { apiConnector } from "../apiConnector";
import { dashboardEndpoints, profileEndpoints } from "../apis";

const {
  GET_STUDENT_DASHBOARD_API,
  GET_COURSE_DETAILS_API,
  GET_COURSE_PROGRESS_API,
  MARK_LECTURE_COMPLETE_API,
  GET_INSTRUCTOR_DASHBOARD_API,
  GET_INSTRUCTOR_COURSES_API,
  GET_ENROLLED_STUDENTS_API,
  SEND_ENCOURAGEMENT_API,
} = dashboardEndpoints;

const { GET_USER_ENROLLED_COURSES_API, UNENROLL_FROM_COURSE_API } = profileEndpoints;

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
  // ALWAYS try to get fresh data from API first to ensure we have the latest course data
  try {
    console.log("Fetching enrolled courses from API...");
    
    // Use the profile endpoint which is properly implemented in the backend
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    
    if (response.data.success && response.data.data) {
      console.log("API returned enrolled courses successfully:", response.data.data.length, "courses");
      
      // Log first course to verify data structure
      if (response.data.data.length > 0) {
        console.log("First course from API:", {
          name: response.data.data[0].courseName,
          thumbnail: response.data.data[0].thumbnail,
          category: response.data.data[0].category?.name,
          instructor: `${response.data.data[0].instructor?.firstName} ${response.data.data[0].instructor?.lastName}`
        });
      }
      
      return response.data;
    }
  } catch (error) {
    console.error("GET_USER_ENROLLED_COURSES_API ERROR:", error);
    console.log("Attempting to use localStorage as fallback...");
    
    // Only use localStorage as a fallback if API fails
    try {
      const { getEnrolledCourses: getLocalEnrolledCourses } = await import('../../utils/enrolledCoursesManager');
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      if (userId) {
        const localCourses = getLocalEnrolledCourses(userId);
        if (localCourses && localCourses.length > 0) {
          console.log("Using localStorage fallback data:", localCourses.length, "courses");
          return { success: true, data: localCourses };
        }
      }
    } catch (localError) {
      console.error("localStorage fallback also failed:", localError);
    }
    
    // If we get here, we have no data, so throw the original error
    throw error;
  }
};

// Helper function to fetch fresh data in the background
async function fetchFreshDataInBackground(token) {
  try {
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Background API fetch successful, could update state here if needed");
    return response.data;
  } catch (error) {
    console.error("Background API fetch failed:", error);
  }
}

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

export const unenrollFromCourse = async (courseId, token) => {
  try {
    // First try to perform the operation locally for immediate feedback
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    if (userId) {
      const { unenrollFromCourse: localUnenrollFromCourse } = await import('../../utils/enrolledCoursesManager');
      localUnenrollFromCourse(courseId, userId);
    }
    
    // Then try to call the API
    try {
      const response = await apiConnector(
        "POST",
        UNENROLL_FROM_COURSE_API,
        { courseId },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      return response.data;
    } catch (apiError) {
      console.error("UNENROLL_FROM_COURSE_API ERROR", apiError);
      
      // If the API fails, we've already updated localStorage, so return a success response
      return {
        success: true,
        message: "Course removed from your local enrollment list. Server sync failed.",
        data: null,
        isLocalOnly: true
      };
    }
  } catch (error) {
    console.error("UNENROLL_FROM_COURSE Error:", error);
    throw error;
  }
};