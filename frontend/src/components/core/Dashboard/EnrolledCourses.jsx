import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiBookOpen, FiClock, FiAward, FiTrendingUp, FiCalendar, FiTarget, FiCheckCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { getEnrolledCourses, unenrollFromCourse as apiUnenrollFromCourse } from '../../../services/operations/dashboardAPI';
import { getInstructorData } from '../../../services/operations/profileAPI';
import InstructorCourseCard from './InstructorCourseCard';
import CourseCard from './CourseCard';
import { apiConnector } from '../../../services/apiConnector';
// We'll import this dynamically when needed to avoid require() issues
// import { unenrollFromCourse as localUnenrollFromCourse, getEnrolledCourses as getLocalEnrolledCourses } from '../../../utils/enrolledCoursesManager';

// Study tips for effective learning
const allStudyTips = [
  {
    title: "Active Recall",
    description: "Test yourself frequently. Try to remember material without looking at notes.",
    icon: <FiTarget className="text-yellow-50 text-xl" />
  },
  {
    title: "Spaced Repetition",
    description: "Review material at increasing intervals for better long-term retention.",
    icon: <FiCalendar className="text-yellow-50 text-xl" />
  },
  {
    title: "Teach Others",
    description: "Explaining concepts to others helps solidify your understanding.",
    icon: <FiAward className="text-yellow-50 text-xl" />
  },
  {
    title: "Take Regular Breaks",
    description: "Use the Pomodoro technique: 25 minutes of focus followed by a 5-minute break.",
    icon: <FiClock className="text-yellow-50 text-xl" />
  },
  {
    title: "Create Mind Maps",
    description: "Visualize connections between concepts to improve understanding.",
    icon: <FiTrendingUp className="text-yellow-50 text-xl" />
  },
  {
    title: "Practical Application",
    description: "Apply what you learn by building small projects or solving problems.",
    icon: <FiCheckCircle className="text-yellow-50 text-xl" />
  }
];

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 bg-richblack-700 rounded-md w-3/4"></div>
      <div className="h-40 bg-richblack-700 rounded-md"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-richblack-700 rounded-md"></div>
        <div className="h-32 bg-richblack-700 rounded-md"></div>
        <div className="h-32 bg-richblack-700 rounded-md"></div>
      </div>
    </div>
  );
};

export default function EnrolledCourses() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [learningStreak, setLearningStreak] = useState(0);
  const [nextMilestone, setNextMilestone] = useState(0);
  const [todayGoal, setTodayGoal] = useState(0);
  const [studyTips, setStudyTips] = useState([]);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  
  // Get account type from localStorage or user profile
  const selectedAccountType = localStorage.getItem('selectedAccountType') || user?.accountType || ACCOUNT_TYPE.STUDENT;
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Clear any stale localStorage data first
        try {
          const userId = user?._id;
          if (userId) {
            const { clearEnrolledCourses } = await import('../../../utils/enrolledCoursesManager');
            clearEnrolledCourses(userId);
            console.log("Cleared stale localStorage data before fetching");
          }
        } catch (clearError) {
          console.error("Error clearing localStorage:", clearError);
        }
        
        let fetchedCourses = [];
        
        if (selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR) {
          // Fetch instructor's courses
          fetchedCourses = await getInstructorData(token);
        } else {
          // Fetch student's enrolled courses
          if (user && user._id) {
            try {
              // Use user ID to get user-specific enrolled courses
              const response = await getEnrolledCourses(token);
              
              // Get courses from the server response
              fetchedCourses = response.data || [];
              
              // Log successful API call and actual course data
              console.log("Successfully fetched enrolled courses:", fetchedCourses.length);
              if (fetchedCourses.length > 0) {
                console.log("First course data:", fetchedCourses[0]);
                console.log("Course structure check:", {
                  hasCategory: !!fetchedCourses[0]?.category,
                  categoryName: fetchedCourses[0]?.category?.name,
                  hasInstructor: !!fetchedCourses[0]?.instructor,
                  instructorName: fetchedCourses[0]?.instructor?.firstName,
                  courseName: fetchedCourses[0]?.courseName,
                  thumbnail: fetchedCourses[0]?.thumbnail
                });
              }
            } catch (error) {
              console.error("Error fetching enrolled courses:", error);
              toast.error("Failed to fetch enrolled courses");
              fetchedCourses = [];
            }
          } else {
            console.warn("No user ID available, cannot fetch enrolled courses");
            fetchedCourses = [];
          }
        }
        
        // Use the courses with actual progress data from API
        const coursesWithProgress = fetchedCourses.map(course => {
          console.log("Processing course:", {
            id: course._id,
            name: course.courseName,
            thumbnail: course.thumbnail,
            category: course.category,
            instructor: course.instructor,
            hasContent: !!course.courseContent
          });
          
          // Use the progress data from the API response
          return {
            ...course,
            progress: course.progress || course.progressPercentage || 0,
            totalLessons: course.totalLessons || course.courseContent?.reduce(
              (acc, section) => acc + (section.subSection?.length || 0), 0
            ) || 0,
            completedLessons: course.completedLessons || 0
          };
        });
        
        console.log("Final courses with progress:", coursesWithProgress);
        setCourses(coursesWithProgress);
        setFilteredCourses(coursesWithProgress);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to fetch courses");
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchCourses();
    }
  }, [token, selectedAccountType]);
  
  // Filter courses based on search query and filter option
  useEffect(() => {
    let result = [...courses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.courseName?.toLowerCase().includes(query) || 
        course.courseDescription?.toLowerCase().includes(query) ||
        course.category?.name?.toLowerCase().includes(query)
      );
    }
    
    // Apply progress filter
    if (filter === 'inProgress') {
      result = result.filter(course => course.progress > 0 && course.progress < 100);
    } else if (filter === 'completed') {
      result = result.filter(course => course.progress === 100);
    } else if (filter === 'notStarted') {
      result = result.filter(course => course.progress === 0);
    }
    
    setFilteredCourses(result);
  }, [courses, searchQuery, filter]);

  // Function to handle unenrolling from a course
  const handleUnenroll = async (courseId) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }
    
    if (!user || !user._id) {
      toast.error('User information not available');
      return;
    }

    setIsUnenrolling(true);
    
    try {
      // Show immediate feedback
      toast.loading('Unenrolling from course...');
      
      // Remove the course from the UI immediately for better UX
      setFilteredCourses(prev => prev.filter(course => course._id !== courseId));
      setCourses(prev => prev.filter(course => course._id !== courseId));
      
      // Call the API to unenroll the user from the course
      // Our improved API function already handles localStorage updates
      const response = await apiUnenrollFromCourse(courseId, token);
      
      // Dismiss any loading toasts
      toast.dismiss();
      
      if (response.success) {
        if (response.isLocalOnly) {
          // If it's local only, show appropriate message
          toast.success('Course removed from your local enrollment list. Server sync will happen when connection is restored.');
        } else {
          // If server update was successful
          toast.success('Successfully unenrolled from course');
        }
      } else {
        toast.error(response.message || 'Failed to unenroll from course');
        
        // If the server rejected the unenrollment, restore the course in UI
        fetchCourses(); // Refresh course list
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      toast.dismiss(); // Dismiss any loading toasts
      toast.error('An error occurred. Course removed from local list only.');
      
      // No need for extra local storage handling here since our improved
      // apiUnenrollFromCourse function already handles it
    } finally {
      setIsUnenrolling(false);
    }
  };

  // Generate random metrics for UI display
  useEffect(() => {
    // Set random learning streak and next milestone
    const randomStreak = Math.floor(Math.random() * 10) + 3; // 3-13 days
    const nextMilestone = 5 - (randomStreak % 5); // Days until next 5-day milestone
    setLearningStreak(randomStreak);
    setNextMilestone(nextMilestone);
    
    // Set random daily goal completion (0-100%)
    setTodayGoal(Math.floor(Math.random() * 100));
    
    // Select random study tips (3)
    const shuffled = [...allStudyTips].sort(() => 0.5 - Math.random());
    setStudyTips(shuffled.slice(0, 3));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSkeleton />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-richblack-800 rounded-lg border border-richblack-700 p-8">
        <FiBookOpen className="text-yellow-50 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-richblack-5 mb-4">
          Start Your Learning Journey Today!
        </h2>
        <p className="text-richblack-300 mb-8 text-center max-w-md">
          Discover courses taught by industry experts and expand your skills with hands-on projects and interactive content.
        </p>
        <Link
          to="/dashboard/course-catalog"
          className="bg-yellow-50 text-richblack-900 py-3 px-6 rounded-md font-medium hover:bg-yellow-100 transition-colors"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-richblack-5">
          {selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR ? "Instructor Dashboard" : "My Enrolled Courses"}
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-richblack-700 text-richblack-5 py-2 px-4 rounded-md border border-richblack-600 focus:outline-none focus:ring-1 focus:ring-yellow-50 w-full"
            />
          </div>
          
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-richblack-700 text-richblack-5 py-2 px-4 rounded-md border border-richblack-600 focus:outline-none focus:ring-1 focus:ring-yellow-50"
          >
            <option value="all">All Courses</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="notStarted">Not Started</option>
          </select>
        </div>
      </div>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Learning Streak */}
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiAward className="text-yellow-50 text-xl" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Learning Streak</p>
              <p className="text-richblack-5 text-xl font-bold">{learningStreak} days</p>
            </div>
          </div>
          <p className="text-xs text-richblack-300">
            {nextMilestone > 0 
              ? `${nextMilestone} more days to reach your next milestone!` 
              : 'You reached a milestone! Keep it up!'}
          </p>
        </div>
        
        {/* Today's Goal */}
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiTarget className="text-yellow-50 text-xl" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Today's Goal</p>
              <p className="text-richblack-5 text-xl font-bold">{todayGoal}% complete</p>
            </div>
          </div>
          <div className="w-full bg-richblack-700 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-50 h-full" style={{ width: `${todayGoal}%` }}></div>
          </div>
        </div>
        
        {/* Course Count */}
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiBookOpen className="text-yellow-50 text-xl" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">
                {selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR ? "Courses Created" : "Courses Enrolled"}
              </p>
              <p className="text-richblack-5 text-xl font-bold">{courses.length}</p>
            </div>
          </div>
          <p className="text-xs text-richblack-300">
            {courses.length > 0 
              ? `${selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR 
                ? "You've created" 
                : "You're enrolled in"} ${courses.length} course${courses.length > 1 ? 's' : ''}`
              : `No ${selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR 
                ? "courses created" 
                : "courses enrolled"} yet`}
          </p>
        </div>
        
        {/* Hours Spent */}
        <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiClock className="text-yellow-50 text-xl" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Hours Spent</p>
              <p className="text-richblack-5 text-xl font-bold">
                {Math.floor(courses.reduce((total, course) => total + (course.totalLessons || 0) / 3, 0))}h
              </p>
            </div>
          </div>
          <p className="text-xs text-richblack-300">Based on estimated course lengths</p>
        </div>
      </div>
      
      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-8 text-center">
          <FiBookOpen className="text-yellow-50 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-richblack-5 mb-2">No courses found</h3>
          <p className="text-richblack-300 mb-6">
            {searchQuery || filter !== 'all' 
              ? "Try adjusting your search or filter settings" 
              : selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR 
                ? "You haven't created any courses yet" 
                : "You haven't enrolled in any courses yet"}
          </p>
          
          <Link 
            to="/dashboard/course-catalog" 
            className="bg-yellow-50 text-richblack-900 py-2 px-4 rounded-md inline-block font-medium hover:bg-yellow-100 transition-colors"
          >
            {selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR 
              ? "Create Your First Course" 
              : "Browse Courses"}
          </Link>
        </div>
      ) : (
        <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6">
          <h2 className="text-xl font-semibold text-richblack-5 mb-6">
            {searchQuery || filter !== 'all' 
              ? `Search Results (${filteredCourses.length})` 
              : selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR 
                ? "Your Courses" 
                : "Your Learning Journey"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                <InstructorCourseCard 
                  key={course._id} 
                  course={course}
                />
              ) : (
                <CourseCard 
                  key={course._id} 
                  course={course} 
                  handleUnenroll={handleUnenroll}
                  isUnenrolling={isUnenrolling}
                />
              )
            ))}
          </div>
        </div>
      )}
      
      {/* Study Tips */}
      <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">
          Tips to Improve Your Learning
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studyTips.map((tip, index) => (
            <div key={index} className="bg-richblack-900 bg-opacity-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-3">
                  {tip.icon}
                </div>
                <h3 className="text-richblack-5 font-medium">{tip.title}</h3>
              </div>
              <p className="text-sm text-richblack-300">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}