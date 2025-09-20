
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import CourseDetails from './pages/CourseDetails';
import CourseDetailPage from './pages/CourseDetailPage';
import Catalog from './pages/Catalog';

import Navbar from "./components/common/Navbar"
import RouteAccessModifier from "./components/common/RouteAccessModifier";

import OpenRoute from "./components/core/Auth/OpenRoute"
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";
import Instructor from "./components/core/Dashboard/Instructor";
import EnrolledStudents from "./components/core/Dashboard/EnrolledStudents";
import CourseContent from "./components/core/Dashboard/CourseContent";
import ViewCourse from "./components/core/Dashboard/ViewCourse";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import CourseCatalog from "./components/core/Dashboard/CourseCatalog";
import StudentDashboard from "./components/core/Dashboard/StudentDashboard";

// Removed Cart feature in new simplified rebuild

import { ACCOUNT_TYPE } from './utils/constants';
import { shouldHaveStudentAccess } from "./utils/accessOverrides";

import { HiArrowNarrowUp } from "react-icons/hi"


function App() {

  const { user } = useSelector((state) => state.profile)

  // Scroll to the top of the page when the component mounts
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  useEffect(() => {
    scrollTo(0, 0);
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  // Go upward arrow - show , unshow
  const [showArrow, setShowArrow] = useState(false)

  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true)
    } else setShowArrow(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleArrow);
    return () => {
      window.removeEventListener('scroll', handleArrow);
    }
  }, [showArrow])


  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      {/* Route Access Modifier to ensure all users can access all dashboard features */}
      <RouteAccessModifier />

      {/* go upward arrow */}
      <button onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${showArrow ? 'bottom-6' : '-bottom-24'} `} >
        <HiArrowNarrowUp />
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/course-details/:courseId" element={<CourseDetailPage />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="signup" element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="login" element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password" element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id" element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />




        {/* Protected Route - for Only Logged in User */}
        {/* Dashboard */}
        <Route element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />

          {/* Routes for all users (formerly student-only routes) */}
          <Route path="dashboard/home" element={<StudentDashboard />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="dashboard/course-catalog" element={<CourseCatalog />} />
          <Route path="dashboard/view-course/:courseId" element={<ViewCourse />} />

          {/* Instructor routes - only shown to instructors but accessible to everyone */}
          <Route path="dashboard/instructor" element={<Instructor />} />
          <Route path="dashboard/enrolled-students/:courseId" element={<EnrolledStudents />} />
          <Route path="dashboard/course-content/:courseId" element={<CourseContent />} />
        </Route>


        {/* For the watching course lectures */}
        {/* Removed nested VideoDetails route referencing missing component */}




        {/* Page Not Found (404 Page ) */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>

    </div>
  );
}

export default App;
