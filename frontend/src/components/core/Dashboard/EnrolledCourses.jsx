import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiBookOpen, FiClock, FiAward, FiTrendingUp, FiCalendar, FiTarget, FiCheckCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getTimeBasedGreeting } from '../../../utils/userUtils';
import { shouldHaveStudentAccess } from '../../../utils/accessOverrides';
import { 
  getUserEnrolledCourses, 
  getOnlyEnrolledCourses,
  enrollUserInCourse,
  unenrollUserFromCourse
} from '../../../utils/userCourseManager';

// Placeholder course images for different categories
const categoryImages = {
  'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=500',
  'Frontend Development': 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&q=80&w=500',
  'Backend Development': 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?auto=format&fit=crop&q=80&w=500',
  'Full Stack Development': 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=500',
  'Mobile Development': 'https://images.unsplash.com/photo-1596742578443-7682ef7b7057?auto=format&fit=crop&q=80&w=500',
  'Flutter': 'https://plus.unsplash.com/premium_photo-1682090786689-741d60a11384?auto=format&fit=crop&q=80&w=500',
  'Programming': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=500',
  'Database': 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=500',
  'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=500',
  'DevOps': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=500',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500'
};

// Sample data for all available courses
const allCourses = [
  {
    _id: '1',
    courseName: 'Introduction to Web Development',
    courseDescription: 'Learn the basics of web development including HTML, CSS, and JavaScript',
    thumbnail: categoryImages['Web Development'],
    instructor: { firstName: 'John', lastName: 'Doe' },
    category: { name: 'Web Development' },
    progress: 35,
    totalLessons: 20,
    completedLessons: 7
  },
  {
    _id: '2',
    courseName: 'Advanced React Patterns',
    courseDescription: 'Master advanced React concepts including hooks, context, and performance optimization',
    thumbnail: categoryImages['Frontend Development'],
    instructor: { firstName: 'Jane', lastName: 'Smith' },
    category: { name: 'Frontend Development' },
    progress: 70,
    totalLessons: 18,
    completedLessons: 12
  },
  {
    _id: '3',
    courseName: 'Node.js Backend Development',
    courseDescription: 'Build scalable and robust backend services with Node.js and Express framework',
    thumbnail: categoryImages['Backend Development'],
    instructor: { firstName: 'Emily', lastName: 'Clark' },
    category: { name: 'Backend Development' },
    progress: 25,
    totalLessons: 24,
    completedLessons: 6
  },
  {
    _id: '4',
    courseName: 'Mobile App Development with Flutter',
    courseDescription: 'Create beautiful cross-platform mobile applications using Flutter and Dart',
    thumbnail: categoryImages['Mobile Development'],
    instructor: { firstName: 'Lisa', lastName: 'Wong' },
    category: { name: 'Mobile Development' },
    progress: 45,
    totalLessons: 22,
    completedLessons: 10
  },
  {
    _id: '5',
    courseName: 'React.js Advanced Concepts',
    courseDescription: 'Take your React skills to the next level with advanced patterns and state management',
    thumbnail: categoryImages['Frontend Development'],
    instructor: { firstName: 'Jessica', lastName: 'Adams' },
    category: { name: 'Frontend Development' },
    progress: 60,
    totalLessons: 15,
    completedLessons: 9
  },
  {
    _id: '6',
    courseName: 'Python Data Science',
    courseDescription: 'Learn Python programming for data analysis, visualization, and machine learning',
    thumbnail: categoryImages['Data Science'],
    instructor: { firstName: 'Robert', lastName: 'Miller' },
    category: { name: 'Data Science' },
    progress: 30,
    totalLessons: 28,
    completedLessons: 8
  },
  {
    _id: '7',
    courseName: 'DevOps for Developers',
    courseDescription: 'Master the essential DevOps tools and practices for continuous integration and deployment',
    thumbnail: categoryImages['DevOps'],
    instructor: { firstName: 'Thomas', lastName: 'Anderson' },
    category: { name: 'DevOps' },
    progress: 20,
    totalLessons: 18,
    completedLessons: 4
  },
  {
    _id: '8',
    courseName: 'Flutter Mobile Development',
    courseDescription: 'Build beautiful cross-platform mobile apps with Flutter and Dart',
    thumbnail: categoryImages['Flutter'],
    instructor: { firstName: 'Lisa', lastName: 'Wong' },
    category: { name: 'Mobile Development' },
    progress: 15,
    totalLessons: 20,
    completedLessons: 3
  }
];

// This will be replaced with actual API calls
const fetchEnrolledCourses = async (userId) => {
  console.log('Fetching enrolled courses for user:', userId);
  
  // For immediate response without timeout to prevent potential race conditions
  try {
    if (!userId) {
      console.warn('No userId provided to fetchEnrolledCourses');
      return [];
    }
    
    // Get the user's enrolled course IDs
    const enrolledCourseIds = getUserEnrolledCourses(userId);
    console.log('Enrolled course IDs:', enrolledCourseIds);
    
    if (!Array.isArray(enrolledCourseIds)) {
      console.warn('Invalid enrolledCourseIds returned', enrolledCourseIds);
      return [];
    }
    
    if (!Array.isArray(allCourses)) {
      console.warn('allCourses is not available or not an array');
      return [];
    }
    
    // Filter all courses to only include those the user is enrolled in
    const userEnrolledCourses = allCourses.filter(course => 
      course && course._id && enrolledCourseIds.includes(course._id)
    ).map(course => {
      // Ensure all course objects have required properties with fallbacks
      return {
        _id: course._id,
        courseName: course.courseName || 'Unnamed Course',
        courseDescription: course.courseDescription || 'No description available',
        thumbnail: course.thumbnail || '',
        instructor: course.instructor || { firstName: 'Unknown', lastName: 'Instructor' },
        category: course.category || { name: 'General' },
        progress: course.progress || 0,
        totalLessons: course.totalLessons || 0,
        completedLessons: course.completedLessons || 0
      };
    });
    
    console.log('User enrolled courses found:', userEnrolledCourses.length);
    return userEnrolledCourses;
  } catch (error) {
    console.error('Error in fetchEnrolledCourses:', error);
    return []; // Return empty array to prevent UI breakage
  }
};

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
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [learningStreak, setLearningStreak] = useState(0);
  const [nextMilestone, setNextMilestone] = useState(0);
  const [todayGoal, setTodayGoal] = useState(0);
  const [studyTips, setStudyTips] = useState([]);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  
  // Always grant access to all users
  const hasAccess = true;

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

  // Function to handle unenrolling from a course
  const handleUnenroll = async (courseId) => {
    if (!user || !user._id) {
      toast.error('User information not available');
      return;
    }

    setIsUnenrolling(true);
    console.log(`Attempting to unenroll user ${user._id} from course ${courseId}`);
    
    try {
      const result = await unenrollUserFromCourse(user._id, courseId);
      console.log('Unenroll result:', result);
      
      if (result.success) {
        // Remove the course from the UI
        setCourses(prev => prev.filter(course => course._id !== courseId));
        toast.success('Successfully unenrolled from course');
      } else {
        toast.error(result.message || 'Failed to unenroll from course');
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      toast.error('An error occurred while unenrolling from the course');
    } finally {
      setIsUnenrolling(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let fetchAttempts = 0;
    const maxAttempts = 3;
    
    // Only fetch courses if the user has access to student dashboard
    const fetchUserCourses = async () => {
      // Don't proceed if component unmounted or too many attempts
      if (!isMounted || fetchAttempts >= maxAttempts) return;
      
      fetchAttempts++;
      console.log(`Fetching courses attempt ${fetchAttempts}`);
      
      if (!(hasAccess && user && user._id)) {
        console.log('Skipping fetch: no access or user ID');
        if (isMounted) {
          setCourses([]);
          setLearningStreak(5);
          setNextMilestone(3);
          setTodayGoal(60);
          
          // Safely set study tips
          try {
            if (Array.isArray(allStudyTips) && allStudyTips.length > 0) {
              setStudyTips(allStudyTips.slice(0, Math.min(3, allStudyTips.length)));
            } else {
              setStudyTips([]);
            }
          } catch (error) {
            console.error('Error setting study tips:', error);
            setStudyTips([]);
          }
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      
      try {
        // Auto-enroll this user in a couple of courses if not already enrolled
        // This is just for demo purposes
        try {
          const enrolledCourses = getUserEnrolledCourses(user._id);
          if (Array.isArray(enrolledCourses) && enrolledCourses.length === 0) {
            console.log('Auto-enrolling user in sample courses');
            // Enroll in sample courses
            const sampleCourseIds = ['1', '3', '5']; // Fixed sample for consistency
            sampleCourseIds.forEach(courseId => {
              enrollUserInCourse(user._id, courseId);
            });
          }
        } catch (enrollError) {
          console.error('Error during auto-enrollment:', enrollError);
          // Continue even if auto-enrollment fails
        }
        
        // Fetch only courses that this specific user is enrolled in
        if (isMounted) {
          console.log('About to fetch enrolled courses');
          const data = await fetchEnrolledCourses(user._id);
          
          if (isMounted) {
            console.log('Setting fetched courses:', data?.length || 0);
            setCourses(Array.isArray(data) ? data : []);
          
            // Set random learning streak and next milestone
            setLearningStreak(Math.floor(Math.random() * 10) + 3); // 3-13 days
            setNextMilestone(5 - (Math.floor(Math.random() * 10) + 3) % 5); // Days until next 5-day milestone
            
            // Set random daily goal completion (0-100%)
            setTodayGoal(Math.floor(Math.random() * 100));
            
            // Select random study tips (3) if available
            try {
              if (Array.isArray(allStudyTips) && allStudyTips.length > 0) {
                const shuffled = [...allStudyTips].sort(() => 0.5 - Math.random());
                setStudyTips(shuffled.slice(0, Math.min(3, shuffled.length)));
              } else {
                setStudyTips([]);
              }
            } catch (error) {
              console.error('Error setting study tips:', error);
              setStudyTips([]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        if (isMounted) {
          // Only show toast on first attempt to avoid spamming
          if (fetchAttempts === 1) {
            toast.error('Failed to fetch enrolled courses. Setting defaults.');
          }
          
          // Even if there's an error, set some default values to ensure UI renders
          setCourses([]);
          setLearningStreak(5);
          setNextMilestone(3);
          setTodayGoal(30);
          
          // Safely set study tips
          try {
            if (Array.isArray(allStudyTips) && allStudyTips.length > 0) {
              setStudyTips(allStudyTips.slice(0, Math.min(3, allStudyTips.length)));
            } else {
              setStudyTips([]);
            }
          } catch (error) {
            console.error('Error setting default study tips:', error);
            setStudyTips([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Execute immediately
    fetchUserCourses();
    
    // Cleanup function
    return () => {
      console.log('Enrolled courses component unmounting');
      isMounted = false;
    };
  }, [hasAccess, user]);  // Removed allStudyTips from dependencies to prevent re-renders

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
          className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-100 transition-all"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-richblack-800 to-richblack-700 rounded-lg border border-richblack-600 p-6">
        <h1 className="text-3xl font-bold text-richblack-5 mb-2">
          {getTimeBasedGreeting(user?.firstName)}
        </h1>
        <p className="text-richblack-300 mb-6">
          Continue your learning journey and build your skills today
        </p>
        
        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-richblack-900 bg-opacity-50 p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiCalendar className="text-yellow-50 text-xl" />
            </div>
            <div>
              <h3 className="text-richblack-5 font-medium">{learningStreak} Day Streak</h3>
              <p className="text-xs text-richblack-300">Keep going! {nextMilestone} days until next milestone</p>
            </div>
          </div>
          
          <div className="bg-richblack-900 bg-opacity-50 p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiTarget className="text-yellow-50 text-xl" />
            </div>
            <div>
              <h3 className="text-richblack-5 font-medium">Today's Goal</h3>
              <div className="w-full bg-richblack-700 h-2 rounded-full mt-1 overflow-hidden">
                <div className="bg-yellow-50 h-full" style={{width: `${todayGoal}%`}}></div>
              </div>
              <p className="text-xs text-richblack-300 mt-1">{todayGoal}% completed</p>
            </div>
          </div>
          
          <div className="bg-richblack-900 bg-opacity-50 p-4 rounded-lg flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-4">
              <FiAward className="text-yellow-50 text-xl" />
            </div>
            <div>
              <h3 className="text-richblack-5 font-medium">Course Progress</h3>
              <p className="text-xs text-richblack-300">
                {courses.length} courses in progress
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Pathway */}
      <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4 flex items-center">
          <FiTrendingUp className="mr-2" /> Your Learning Pathway
        </h2>
        
        <div className="relative pb-8">
          <div className="absolute left-8 top-0 h-full w-0.5 bg-richblack-600"></div>
          
          {courses.slice(0, 3).map((course, index) => (
            <div key={course._id} className="relative mb-6 flex">
              <div className="absolute left-8 -ml-3 mt-2 h-6 w-6 rounded-full bg-yellow-50 z-10 flex items-center justify-center">
                <span className="text-xs font-bold text-richblack-900">{index + 1}</span>
              </div>
              
              <div className="ml-16 bg-richblack-700 rounded-lg p-4 flex-1">
                <h3 className="text-richblack-5 font-medium">{course.courseName}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-richblack-300">{course.progress}% complete</p>
                  <Link 
                    to={`/dashboard/view-course/${course._id}`}
                    className="text-xs text-yellow-50 hover:underline"
                  >
                    Continue Learning →
                  </Link>
                </div>
                <div className="w-full bg-richblack-600 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-yellow-50 h-full" style={{width: `${course.progress}%`}}></div>
                </div>
              </div>
            </div>
          ))}
          
          {courses.length > 3 && (
            <div className="ml-16 text-center mt-2">
              <Link 
                to="/dashboard/enrolled-courses"
                className="text-sm text-yellow-50 hover:underline"
              >
                View all {courses.length} courses
              </Link>
            </div>
          )}
        </div>
      </div>
      
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
      
      {/* Recent Courses */}
      <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-richblack-5">
            Continue Learning
          </h2>
          <Link 
            to="/dashboard/enrolled-courses"
            className="text-sm text-yellow-50 hover:underline"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              handleUnenroll={handleUnenroll}
              isUnenrolling={isUnenrolling}
            />
          ))}
        </div>
        
        {/* Motivational Quote */}
        <div className="mt-8 bg-yellow-900 bg-opacity-20 p-6 rounded-lg border border-yellow-800">
          <blockquote className="text-yellow-50 italic">
            "Education is not the filling of a pail, but the lighting of a fire."
          </blockquote>
          <p className="text-right text-sm text-yellow-100 mt-2">— William Butler Yeats</p>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, handleUnenroll, isUnenrolling }) {
  // Safely handle null/undefined course objects
  if (!course) {
    console.error('CourseCard received undefined or null course');
    return null;
  }

  // Calculate the estimated time to complete based on progress
  const estimatedTimeLeft = Math.ceil((100 - (course.progress || 0)) / 10); // Safely handle missing progress
  
  // Generate a random achievement for the course
  const achievements = [
    "Fast learner",
    "Consistent practice",
    "Quick problem solver",
    "Active participant",
    "Detailed notes taker"
  ];
  const achievement = achievements[Math.floor(Math.random() * achievements.length)];
  
  // Safely handle missing category
  const categoryName = course.category?.name || 'Course';
  
  return (
    <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-50 hover:transform hover:scale-[1.01] transition-all duration-300 shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || `https://placehold.co/500x300/222/444?text=${encodeURIComponent(categoryName)}`}
          alt={course.courseName || 'Course'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/500x300/222/444?text=Course";
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            onClick={() => handleUnenroll && handleUnenroll(course._id)}
            disabled={isUnenrolling}
            className="bg-richblack-900 bg-opacity-80 hover:bg-richblack-800 text-richblack-300 hover:text-yellow-50 p-2 rounded-full transition-colors"
            title="Unenroll from course"
          >
            <FiX />
          </button>
          <div className="bg-yellow-50 text-richblack-900 text-xs font-semibold px-2 py-1 rounded-full">
            {course.progress || 0}% Complete
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-richblack-900 to-transparent h-16"></div>
      </div>
      <div className="p-4">
        <h3 className="text-richblack-5 font-semibold text-lg line-clamp-1 hover:text-yellow-50 transition-colors">
          {course.courseName || 'Unnamed Course'}
        </h3>
        <p className="text-yellow-50 text-xs">{categoryName}</p>
        
        <div className="flex items-center mt-2 mb-2">
          <div className="h-5 w-5 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center">
            <FiAward className="text-yellow-50 text-xs" />
          </div>
          <p className="text-xs text-yellow-50 ml-2">{achievement}</p>
        </div>

        <div className="mt-3 mb-3">
          <div className="h-2 w-full bg-richblack-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-50"
              style={{ width: `${course.progress || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-richblack-300 flex items-center">
              <FiClock className="mr-1" /> Est. {estimatedTimeLeft} day{estimatedTimeLeft !== 1 ? 's' : ''} left
            </span>
            <span className="text-yellow-50">
              {course.completedLessons || Math.round((course.progress || 0) / 100 * (course.totalLessons || 20))}/{course.totalLessons || 20} Lessons
            </span>
          </div>
        </div>

        <div className="bg-richblack-900 bg-opacity-50 p-2 rounded-md mb-4">
          <p className="text-xs text-richblack-300">
            <span className="text-yellow-50 font-medium">Daily Goal:</span> Complete {Math.max(1, Math.floor((course.totalLessons || 20) * 0.05))} lesson{Math.floor((course.totalLessons || 20) * 0.05) !== 1 ? 's' : ''} per day to finish on time
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          {course._id && (
            <>
              <Link
                to={`/course-details/${course._id}`}
                className="flex-1 flex items-center justify-center border border-yellow-50 text-yellow-50 py-2 rounded-md font-semibold hover:bg-yellow-50 hover:text-richblack-900 transition-all"
              >
                Details
              </Link>
              <Link
                to={`/dashboard/view-course/${course._id}`}
                className="flex-1 flex items-center justify-center bg-yellow-50 text-richblack-900 py-2 rounded-md font-semibold hover:bg-yellow-100 transition-all"
              >
                <FiBookOpen className="mr-2" />
                Continue
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}