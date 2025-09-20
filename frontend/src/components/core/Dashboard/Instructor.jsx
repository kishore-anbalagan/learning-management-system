import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiUsers, FiBookOpen, FiStar, FiBarChart2, FiAward, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getInstructorData } from '../../../services/operations/profileAPI';
import { dashboardEndpoints } from '../../../services/apis';
import { apiConnector } from '../../../services/apiConnector';

export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchInstructorDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch instructor dashboard data
        const response = await apiConnector(
          "GET", 
          dashboardEndpoints.GET_INSTRUCTOR_DASHBOARD_API, 
          null, 
          { Authorization: `Bearer ${token}` }
        );
        
        console.log("Instructor dashboard data:", response.data);
        
        if (response.data.success) {
          const dashboardData = response.data.data;
          setData({
            courses: dashboardData.courses.map(course => ({
              ...course,
              studentsCount: course.enrollmentCount || 0,
              reviewsCount: course.totalReviews || 0
            })),
            stats: {
              totalStudents: dashboardData.stats.totalStudents || 0,
              totalCourses: dashboardData.stats.totalCourses || 0,
              totalEnrollments: dashboardData.stats.totalEnrollments || 0,
              totalRevenue: dashboardData.stats.totalRevenue || 0
            },
            instructor: {
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
              email: user?.email || ''
            }
          });
          
          setStats({
            totalStudents: dashboardData.stats.totalStudents || 0,
            totalCourses: dashboardData.stats.totalCourses || 0,
            totalEnrollments: dashboardData.stats.totalEnrollments || 0,
            totalRevenue: dashboardData.stats.totalRevenue || 0
          });
        } else {
          toast.error(response.data.message || "Failed to fetch instructor data");
          // Set some default data for UI rendering
          setDefaultData();
        }
      } catch (error) {
        console.error('Error fetching instructor data:', error);
        toast.error('Failed to fetch instructor dashboard data');
        // Set some default data for UI rendering
        setDefaultData();
      } finally {
        setLoading(false);
      }
    };
    
    const setDefaultData = () => {
      setData({
        courses: [],
        stats: {
          totalStudents: 0,
          totalCourses: 0,
          totalEnrollments: 0,
          totalRevenue: 0
        },
        instructor: {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || ''
        }
      });
    };

    if (token) {
      fetchInstructorDashboardData();
    }
  }, [token, user]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-richblack-5 text-xl mb-2">No data available</p>
        <p className="text-richblack-300">Try refreshing the page</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-richblack-5 mb-2">
            Instructor Dashboard
          </h1>
          <p className="text-richblack-300">
            Welcome back, {data.instructor.firstName}! Here's an overview of your courses and performance.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/dashboard/add-course"
            className="bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md font-medium hover:bg-yellow-100 transition-all flex items-center"
          >
            <span className="mr-2">+</span> Add New Course
          </Link>
        </div>
      </div>

      {/* Enrollment Summary */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">
          Enrollment Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiUsers className="text-yellow-50 text-2xl" />}
            title="Total Students"
            value={data.stats.totalStudents}
            bgColor="bg-richblack-700"
            description="Unique students across all courses"
          />
          <StatCard
            icon={<FiBookOpen className="text-yellow-50 text-2xl" />}
            title="Total Courses"
            value={data.stats.totalCourses}
            bgColor="bg-richblack-700"
            description="Courses you've created"
          />
          <StatCard
            icon={<FiAward className="text-yellow-50 text-2xl" />}
            title="Total Enrollments"
            value={data.stats.totalEnrollments}
            bgColor="bg-richblack-700"
            description="Total course registrations"
          />
          <StatCard
            icon={<FiBarChart2 className="text-yellow-50 text-2xl" />}
            title="Average Rating"
            value={data.courses.length > 0 
              ? (data.courses.reduce((sum, course) => sum + (course.averageRating || 0), 0) / data.courses.filter(c => c.averageRating).length).toFixed(1) || "0.0"
              : "0.0"
            }
            bgColor="bg-richblack-700"
            description="From student feedback"
          />
        </div>
      </div>

      {/* Course Performance & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 col-span-1">
          <h2 className="text-xl font-semibold text-richblack-5 mb-4">
            Enrollment Growth
          </h2>
          <div className="h-[150px] flex items-end justify-between space-x-2">
            {/* Simulated enrollment chart bars */}
            {[30, 45, 60, 50, 75, 65, 85].map((height, index) => (
              <div key={index} className="relative w-full">
                <div 
                  className="bg-yellow-50 hover:bg-yellow-100 transition-all rounded-t-sm" 
                  style={{ height: `${height}%` }}
                  title={`${height}% growth`}
                ></div>
                <div className="text-xs text-richblack-400 text-center mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-richblack-300 text-sm">Weekly Enrollment Activity</p>
            <p className="text-yellow-50 text-sm mt-1 font-medium">+{data.stats.totalEnrollments || 0} new enrollments this week</p>
          </div>
        </div>
        
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-richblack-5 mb-4">
            Student Engagement
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-richblack-700 p-4 rounded-md">
              <p className="text-richblack-300 text-sm mb-1">Course Completion Rate</p>
              <div className="flex items-center justify-between">
                <p className="text-richblack-5 text-lg font-bold">72%</p>
                <div className="w-24 h-2 bg-richblack-600 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-50" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-richblack-700 p-4 rounded-md">
              <p className="text-richblack-300 text-sm mb-1">Lecture Watch Rate</p>
              <div className="flex items-center justify-between">
                <p className="text-richblack-5 text-lg font-bold">65%</p>
                <div className="w-24 h-2 bg-richblack-600 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-50" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-richblack-700 p-4 rounded-md">
            <p className="text-richblack-300 text-sm mb-1">Recent Students</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[1,2,3,4,5].map((_, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full bg-richblack-600"></div>
              ))}
              <div className="w-8 h-8 rounded-full bg-richblack-600 flex items-center justify-center">
                <span className="text-xs text-richblack-300">+12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">
          Your Courses ({data.stats.totalCourses})
        </h2>

        {data.courses.length === 0 ? (
          <div className="text-center py-10 bg-richblack-800 rounded-lg border border-richblack-700">
            <p className="text-richblack-5 text-xl mb-2">No courses yet</p>
            <p className="text-richblack-300 mb-4">Create your first course to get started</p>
            <Link
              to="/dashboard/add-course"
              className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-md font-medium hover:bg-yellow-100 transition-all"
            >
              Create Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor, description }) {
  return (
    <div className={`${bgColor} p-6 rounded-lg border border-richblack-600`}>
      <div className="flex items-center mb-2">
        <div className="rounded-full bg-richblack-800 p-3 mr-4">
          {icon}
        </div>
        <div>
          <p className="text-richblack-300 text-sm">{title}</p>
          <p className="text-richblack-5 text-2xl font-bold">{value}</p>
        </div>
      </div>
      {description && (
        <p className="text-richblack-400 text-xs mt-2 pl-1">{description}</p>
      )}
    </div>
  );
}

function CourseCard({ course }) {
  const courseStatus = course.status || 'Draft';
  const thumbnail = course.thumbnail || 'https://placehold.co/300x200/1a1a1a/ffffff?text=Course';
  
  return (
    <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-100 hover:transform hover:scale-[1.01] transition-all shadow-sm">
      <div className="relative">
        <img
          src={thumbnail}
          alt={course.courseName || 'Course'}
          className="h-40 w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x200/1a1a1a/ffffff?text=Course";
          }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
          courseStatus.toLowerCase() === 'published' 
            ? 'bg-caribbeangreen-200 text-caribbeangreen-600' 
            : 'bg-pink-200 text-pink-600'
        }`}>
          {courseStatus}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-richblack-5 font-semibold text-lg line-clamp-1">
          {course.courseName || 'Untitled Course'}
        </h3>
        <p className="text-richblack-300 text-sm mt-1 mb-3 line-clamp-2">
          {course.courseDescription || 'No description available'}
        </p>
        
        {/* Enrollment Stats */}
        <div className="bg-richblack-900 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <FiUsers className="text-yellow-50 mr-2" />
              <span className="text-richblack-5 font-medium">{course.studentsCount || 0}</span>
            </div>
            <span className="text-richblack-300 text-xs">Enrolled Students</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FiStar className="text-yellow-50 mr-2" />
              <span className="text-richblack-5 font-medium">
                {course.averageRating ? course.averageRating.toFixed(1) : '0.0'}
              </span>
            </div>
            <span className="text-richblack-300 text-xs">
              {course.reviewsCount || 0} {course.reviewsCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/dashboard/edit-course/${course._id}`}
            className="bg-richblack-700 text-richblack-50 py-2 rounded-md font-medium text-center hover:bg-richblack-600 transition-all"
          >
            Edit Course
          </Link>
          <Link
            to={`/dashboard/enrolled-students/${course._id}`}
            className="bg-yellow-50 text-richblack-900 py-2 rounded-md font-medium text-center hover:bg-yellow-100 transition-all"
          >
            View Students
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="h-8 w-64 bg-richblack-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-96 bg-richblack-700 rounded animate-pulse"></div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="h-10 w-32 bg-richblack-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Enrollment Summary Skeleton */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="h-6 w-48 bg-richblack-700 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-richblack-700 p-6 rounded-lg border border-richblack-600"
            >
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-richblack-800 p-3 mr-4 animate-pulse h-12 w-12"></div>
                <div className="flex-1">
                  <div className="h-4 w-20 bg-richblack-600 rounded mb-2 animate-pulse"></div>
                  <div className="h-6 w-16 bg-richblack-600 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-3 w-full bg-richblack-600 rounded animate-pulse mt-2"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Course Performance & Growth Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 col-span-1">
          <div className="h-6 w-40 bg-richblack-700 rounded mb-4 animate-pulse"></div>
          <div className="h-[150px] flex items-end justify-between space-x-2">
            {[1,2,3,4,5,6,7].map((_, index) => (
              <div key={index} className="relative w-full">
                <div 
                  className="bg-richblack-700 animate-pulse rounded-t-sm" 
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
                <div className="h-3 w-full bg-richblack-700 rounded animate-pulse mt-1"></div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="h-4 w-full bg-richblack-700 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 mx-auto bg-richblack-700 rounded animate-pulse mt-1"></div>
          </div>
        </div>
        
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 col-span-1 lg:col-span-2">
          <div className="h-6 w-40 bg-richblack-700 rounded mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-richblack-700 p-4 rounded-md">
              <div className="h-4 w-32 bg-richblack-600 rounded animate-pulse mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="h-5 w-10 bg-richblack-600 rounded animate-pulse"></div>
                <div className="w-24 h-2 bg-richblack-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="bg-richblack-700 p-4 rounded-md">
              <div className="h-4 w-32 bg-richblack-600 rounded animate-pulse mb-2"></div>
              <div className="flex items-center justify-between">
                <div className="h-5 w-10 bg-richblack-600 rounded animate-pulse"></div>
                <div className="w-24 h-2 bg-richblack-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="bg-richblack-700 p-4 rounded-md">
            <div className="h-4 w-32 bg-richblack-600 rounded animate-pulse mb-2"></div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[1,2,3,4,5,6].map((_, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full bg-richblack-600 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Skeleton */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-richblack-700 rounded mb-4 animate-pulse"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700"
            >
              <div className="h-40 w-full bg-richblack-700 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-richblack-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-richblack-700 rounded mb-3 animate-pulse"></div>
                
                {/* Enrollment Stats Skeleton */}
                <div className="bg-richblack-900 rounded-md p-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-20 bg-richblack-700 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-richblack-700 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-richblack-700 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-richblack-700 rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-richblack-700 rounded animate-pulse"></div>
                  <div className="h-10 bg-richblack-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}