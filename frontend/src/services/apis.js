// Add fallback for when environment variable is not defined
const BASE_URL = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:4000/api/v1';

// Log the base URL to help with debugging
console.log("API Base URL:", BASE_URL);

// AUTH ENDPOINTS
export const endpoints = {
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  DELETE_ACCOUNT_API: BASE_URL + "/profile/deleteProfile",
}

// DASHBOARD ENDPOINTS
export const dashboardEndpoints = {
  // Student dashboard
  GET_STUDENT_DASHBOARD_API: BASE_URL + "/dashboard/student",
  GET_ENROLLED_COURSES_API: BASE_URL + "/dashboard/enrolled-courses",
  GET_COURSE_DETAILS_API: BASE_URL + "/dashboard/course",
  GET_COURSE_PROGRESS_API: BASE_URL + "/dashboard/course-progress",
  MARK_LECTURE_COMPLETE_API: BASE_URL + "/dashboard/mark-complete",
  UNENROLL_FROM_COURSE_API: BASE_URL + "/dashboard/unenroll",
  
  // Instructor dashboard
  GET_INSTRUCTOR_DASHBOARD_API: BASE_URL + "/dashboard/instructor",
  GET_INSTRUCTOR_COURSES_API: BASE_URL + "/dashboard/instructor/courses",
  GET_ENROLLED_STUDENTS_API: BASE_URL + "/dashboard/instructor/students",
  SEND_ENCOURAGEMENT_API: BASE_URL + "/dashboard/encourage",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSES_API: BASE_URL + "/course/getAllCourses",
  GET_COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  GET_ENROLLED_COURSES_API: BASE_URL + "/course/getEnrolledCourses",
  ENROLL_IN_COURSE_API: BASE_URL + "/course/enrollCourse",
  GET_COURSE_CONTENT_API: BASE_URL + "/course/getCourseContent",
  MARK_SUBSECTION_COMPLETE_API: BASE_URL + "/course/markSubSectionComplete",
  GET_COURSE_STUDENTS_API: BASE_URL + "/course/getCourseStudents",
  SEND_COURSE_ENCOURAGEMENT_API: BASE_URL + "/course/sendEncouragement",
  GET_COURSE_PROGRESS_API: BASE_URL + "/course/getProgress",
  UPDATE_COURSE_PROGRESS_API: BASE_URL + "/course/updateProgress",
  
  // Section and subsection endpoints
  ADD_SECTION_API: BASE_URL + "/course/addSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  ADD_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
}

// CATEGORY ENDPOINTS
export const categoryEndpoints = {
  GET_ALL_CATEGORIES_API: BASE_URL + "/category/showAllCategories",
  CREATE_CATEGORY_API: BASE_URL + "/category/createCategory",
  GET_CATEGORY_COURSES_API: BASE_URL + "/category/getCategoryPageDetails",
}

// PAYMENT ENDPOINTS
export const paymentEndpoints = {
  CAPTURE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  VERIFY_PAYMENT_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// SETTINGS ENDPOINTS
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// CONTACT-US ENDPOINTS
export const contactEndpoints = {
  CONTACT_US_API: BASE_URL + "/contact/submit",
}

// CATALOG / PAGE DATA (added to satisfy pageAndComponentData.js import)
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/catalog/page-data",
}