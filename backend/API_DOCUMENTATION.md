# Learning Management System - Backend API Documentation

## Changes Made

### 1. Removed OTP Verification Process
- Modified `controllers/auth.js` signup function to remove OTP requirements
- Removed OTP route from `routes/user.js`
- Users can now signup directly without email verification

### 2. Enhanced Login Response
- Modified `controllers/auth.js` login function to include `redirectTo: '/dashboard'` in response
- Frontend can use this to redirect users to dashboard after successful login

### 3. New Dashboard API Endpoints

#### Base URL: `/api/v1/dashboard`

#### General Dashboard Route
- **GET** `/` - Get dashboard data based on user type (requires authentication)
  - Automatically returns student or instructor dashboard based on account type

#### Student Dashboard Routes
- **GET** `/student` - Get student dashboard data (requires student authentication)
  - Returns: Available courses for enrollment, enrolled courses with progress
  
- **GET** `/courses/available` - Get all available courses for enrollment
  - Returns: Published courses that student hasn't enrolled in yet
  
- **POST** `/enroll` - Enroll in a course
  - Body: `{ courseId: "course_id" }`
  - Creates course progress entry and updates enrollment records
  
- **GET** `/course/:courseId/learn` - Get course learning content for enrolled student
  - Returns: Course content with sections, subsections, and user progress

#### Instructor Dashboard Routes
- **GET** `/instructor` - Get instructor dashboard data (requires instructor authentication)
  - Returns: Created courses, enrolled students, enrollment statistics
  
- **POST** `/encourage` - Send encouragement message to students
  - Body: `{ courseId: "course_id", message: "message", studentIds: ["id1", "id2"] }`
  - Optional: If studentIds not provided, sends to all enrolled students

## User Account Types
- **Student**: Can view and enroll in courses, track learning progress
- **Instructor**: Can view their course statistics, enrolled students, and send encouragement messages
- **Admin**: Existing admin functionality remains unchanged

## Authentication & Authorization
- All dashboard routes require authentication (`auth` middleware)
- Student-specific routes require `isStudent` middleware
- Instructor-specific routes require `isInstructor` middleware

## Database Schema Updates
No database schema changes were required. The existing models support all new functionality:
- `User` model handles students and instructors
- `Course` model tracks enrolled students
- `CourseProgress` model tracks individual student progress

## Frontend Integration
1. **Signup Flow**: Remove OTP verification UI, redirect to login after successful signup
2. **Login Flow**: Use `redirectTo` field in login response to redirect to dashboard
3. **Dashboard**: Call `/api/v1/dashboard` to get appropriate dashboard data based on user type
4. **Course Enrollment**: Use `/api/v1/dashboard/enroll` endpoint for student course enrollment
5. **Course Learning**: Use `/api/v1/dashboard/course/:courseId/learn` for course content access

## Security Features
- JWT-based authentication maintained
- Role-based access control for different user types
- Protected routes ensure users can only access their own data
- Enrollment validation prevents duplicate enrollments

## Error Handling
All endpoints include comprehensive error handling with appropriate HTTP status codes and descriptive error messages.