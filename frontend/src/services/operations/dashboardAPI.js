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
  UNENROLL_FROM_COURSE_API,
} = dashboardEndpoints;

const { GET_USER_ENROLLED_COURSES_API } = profileEndpoints;

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
  // First, try to get data from localStorage as an immediate response
  let localCoursesData = null;
  
  try {
    // Import dynamically to avoid require() issues
    const { getEnrolledCourses: getLocalEnrolledCourses } = await import('../../utils/enrolledCoursesManager');
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    if (userId) {
      const localCourses = getLocalEnrolledCourses(userId);
      if (localCourses && localCourses.length > 0) {
        console.log("Retrieved enrolled courses from localStorage:", localCourses);
        localCoursesData = { success: true, data: localCourses };
      }
    }
  } catch (localError) {
    console.error("Initial localStorage read failed:", localError);
  }
  
  // If we have local data, return it right away
  if (localCoursesData?.data?.length > 0) {
    console.log("Using local enrolled courses data");
    
    // Try to get fresh data from API in the background (don't await)
    fetchFreshDataInBackground(token);
    
    return localCoursesData;
  }
  
  // If no local data, try the API
  try {
    // Use the profile endpoint which is properly implemented in the backend
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("API returned enrolled courses successfully");
    return response.data;
  } catch (error) {
    console.error("GET_USER_ENROLLED_COURSES_API ERROR", error);
    
    // If we have ANY local data as fallback, use it now
    if (localCoursesData) {
      console.log("API failed, falling back to localStorage data");
      return localCoursesData;
    }
    
    // Last resort - try one more time to get localStorage data
    try {
      const { getEnrolledCourses: getLocalEnrolledCourses } = await import('../../utils/enrolledCoursesManager');
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      if (userId) {
        const localCourses = getLocalEnrolledCourses(userId);
        if (localCourses && localCourses.length > 0) {
          console.log("Last resort: Retrieved enrolled courses from localStorage");
          return { success: true, data: localCourses };
        }
      }
    } catch (localError) {
      console.error("Final localStorage fallback failed:", localError);
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