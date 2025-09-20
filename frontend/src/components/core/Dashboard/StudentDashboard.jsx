import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiClock, FiBookOpen, FiAward, FiCalendar, FiSearch } from 'react-icons/fi';
import { getStudentDashboard } from '../../../services/operations/dashboardAPI';
import Loading from '../../common/Loading';
import { getTimeBasedGreeting } from '../../../utils/courseAccessUtils';
import { shouldHaveStudentAccess } from '../../../utils/accessOverrides';

// Placeholder data for development
const progressData = [
  { courseId: '1', courseName: 'JavaScript for Beginners', progress: 65, totalVideos: 24, completedVideos: 16 },
  { courseId: '2', courseName: 'MongoDB Masterclass', progress: 30, totalVideos: 18, completedVideos: 5 },
  { courseId: '3', courseName: 'Node.js Backend Development', progress: 10, totalVideos: 32, completedVideos: 3 },
];

const courseRecommendations = [
  {
    _id: '5',
    courseName: 'React.js Advanced Concepts',
    courseDescription: 'Take your React skills to the next level with advanced patterns and state management',
    thumbnail: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&q=80&w=500',
    instructor: { firstName: 'Jessica', lastName: 'Adams' },
    category: { name: 'Frontend Development' },
    price: 2799,
    averageRating: 4.8,
  },
  {
    _id: '6',
    courseName: 'Python Data Science',
    courseDescription: 'Learn Python programming for data analysis, visualization, and machine learning',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
    instructor: { firstName: 'Robert', lastName: 'Miller' },
    category: { name: 'Data Science' },
    price: 3299,
    averageRating: 4.7,
  },
];

const skillImprovementTips = [
  {
    title: "Build Real Projects",
    description: "Apply your knowledge by building real-world projects. This reinforces learning and gives you portfolio pieces.",
    icon: "🚀",
    resources: ["GitHub Project Ideas", "Frontend Mentor Challenges", "Kaggle Competitions"]
  },
  {
    title: "Consistent Practice",
    description: "Regular coding practice is crucial. Aim for at least 30 minutes of focused practice daily.",
    icon: "⏱️",
    resources: ["LeetCode", "HackerRank", "CodeWars"]
  },
  {
    title: "Join Coding Communities",
    description: "Connect with other learners to share knowledge and get feedback on your code.",
    icon: "👥",
    resources: ["Stack Overflow", "Dev.to", "Reddit Programming Communities"]
  },
  {
    title: "Follow Industry Trends",
    description: "Stay updated with the latest technologies and best practices in your field.",
    icon: "📈",
    resources: ["Medium Tech Articles", "GitHub Trending", "Tech Newsletters"]
  }
];

const learningPathways = [
  {
    title: "Web Development",
    courses: ["HTML/CSS Fundamentals", "JavaScript for Beginners", "React.js Advanced Concepts"],
    skills: ["Frontend Development", "Responsive Design", "API Integration"]
  },
  {
    title: "Data Science",
    courses: ["Python Fundamentals", "Data Analysis with Pandas", "Machine Learning Basics"],
    skills: ["Data Visualization", "Statistical Analysis", "Predictive Modeling"]
  },
  {
    title: "Mobile Development",
    courses: ["Flutter Mobile Development", "React Native Essentials", "iOS App Development"],
    skills: ["Cross-platform Development", "UI/UX Design", "App Deployment"]
  }
];

const recentActivities = [
  { 
    type: 'lecture_completed', 
    courseName: 'JavaScript for Beginners', 
    lectureName: 'Async/Await in Modern JavaScript', 
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) 
  },
  { 
    type: 'quiz_completed', 
    courseName: 'MongoDB Masterclass', 
    quizName: 'Database Indexing Quiz', 
    score: 85, 
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) 
  },
  { 
    type: 'course_started', 
    courseName: 'Node.js Backend Development', 
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) 
  }
];

export default function StudentDashboard() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // When backend API is ready, uncomment this
        // const data = await getStudentDashboard(token);
        // setDashboardData(data.data);
        
        // For now, use placeholder data
        setTimeout(() => {
          // Always enable access to dashboard data for all users
          setDashboardData({
            enrolledCourses: progressData,
            availableCourses: courseRecommendations,
            recentActivities: recentActivities,
            skillImprovementTips: skillImprovementTips,
            learningPathways: learningPathways,
            stats: {
              totalCoursesEnrolled: progressData.length,
              coursesCompleted: 1,
              averageProgress: 35,
              totalLecturesWatched: 24,
            },
          });
          setLoading(false);
          console.log("Dashboard data loaded for all users regardless of role");
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    // Always fetch dashboard data regardless of user type
    if (shouldHaveStudentAccess(user)) {
      fetchDashboardData();
    } else {
      // Fallback for unexpected cases (should never happen with our overrides)
      fetchDashboardData();
    }
  }, [token, user]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="text-richblack-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{getTimeBasedGreeting(user)}</h1>
          <p className="text-richblack-300">
            Track your progress, continue learning, and explore new courses.
          </p>
        </div>
        
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-300" />
          <input
            type="text"
            placeholder="Search your courses..."
            className="w-full md:w-64 bg-richblack-700 text-richblack-5 rounded-md py-2 px-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-richblack-300">Enrolled Courses</h3>
            <FiBookOpen className="text-yellow-50 text-xl" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.stats.totalCoursesEnrolled}</p>
        </div>
        
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-richblack-300">Completed</h3>
            <FiAward className="text-yellow-50 text-xl" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.stats.coursesCompleted}</p>
          <p className="text-richblack-300 text-sm">
            {Math.round((dashboardData.stats.coursesCompleted / dashboardData.stats.totalCoursesEnrolled) * 100)}% completion rate
          </p>
        </div>
        
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-richblack-300">Progress</h3>
            <FiClock className="text-yellow-50 text-xl" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.stats.averageProgress}%</p>
          <p className="text-richblack-300 text-sm">Average across all courses</p>
        </div>
        
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-richblack-300">Lectures Watched</h3>
            <FiCalendar className="text-yellow-50 text-xl" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.stats.totalLecturesWatched}</p>
        </div>
      </div>

      {/* Course Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Learning Progress</h2>
          <Link to="/dashboard/enrolled-courses" className="text-yellow-50 text-sm hover:underline">
            View all courses
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {dashboardData.enrolledCourses.map((course) => (
            <div key={course.courseId} className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{course.courseName}</h3>
                  <div className="flex items-center text-sm text-richblack-300 mb-3">
                    <span>{course.completedVideos} of {course.totalVideos} lectures completed</span>
                    <span className="mx-2">•</span>
                    <span>{course.progress}% complete</span>
                  </div>
                  
                  <div className="w-full bg-richblack-700 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-yellow-50 h-2.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link 
                  to={`/dashboard/view-course/${course.courseId}`}
                  className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md font-semibold hover:bg-yellow-100 transition-all text-center"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        
        <div className="bg-richblack-800 rounded-lg border border-richblack-700 divide-y divide-richblack-700">
          {dashboardData.recentActivities.length === 0 ? (
            <div className="p-4 text-center text-richblack-300">
              No recent activities found.
            </div>
          ) : (
            dashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {activity.type === 'lecture_completed' && (
                      <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                        <FiBookOpen className="text-green-300" />
                      </div>
                    )}
                    {activity.type === 'quiz_completed' && (
                      <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                        <FiAward className="text-blue-300" />
                      </div>
                    )}
                    {activity.type === 'course_started' && (
                      <div className="w-8 h-8 bg-yellow-700 rounded-full flex items-center justify-center">
                        <FiClock className="text-yellow-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                      <h4 className="font-semibold">
                        {activity.type === 'lecture_completed' && 'Completed a lecture'}
                        {activity.type === 'quiz_completed' && 'Completed a quiz'}
                        {activity.type === 'course_started' && 'Started a new course'}
                      </h4>
                      <span className="text-sm text-richblack-300">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                    
                    <p className="text-richblack-300">
                      {activity.type === 'lecture_completed' && (
                        <>Completed <span className="text-yellow-50">{activity.lectureName}</span> in {activity.courseName}</>
                      )}
                      {activity.type === 'quiz_completed' && (
                        <>Scored <span className="text-yellow-50">{activity.score}%</span> on {activity.quizName} in {activity.courseName}</>
                      )}
                      {activity.type === 'course_started' && (
                        <>Started learning <span className="text-yellow-50">{activity.courseName}</span></>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recommended For You</h2>
          <Link to="/dashboard/course-catalog" className="text-yellow-50 text-sm hover:underline">
            View all courses
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.availableCourses.map((course) => (
            <div key={course._id} className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-50 transition-all">
              <div className="flex flex-col md:flex-row">
                <img 
                  src={course.thumbnail} 
                  alt={course.courseName} 
                  className="w-full md:w-32 h-32 object-cover"
                />
                
                <div className="p-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{course.courseName}</h3>
                    <span className="text-yellow-50 bg-richblack-700 px-2 py-1 rounded text-xs">
                      ★ {course.averageRating.toFixed(1)}
                    </span>
                  </div>
                  
                  <p className="text-richblack-300 text-sm my-2 line-clamp-2">
                    {course.courseDescription}
                  </p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-yellow-50 font-semibold">₹{course.price}</span>
                    <Link 
                      to={`/courses/${course._id}`}
                      className="px-3 py-1 bg-yellow-50 text-richblack-900 rounded font-semibold text-sm hover:bg-yellow-100 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Improvement Tips */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Improve Your Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.skillImprovementTips.map((tip, index) => (
            <div key={index} className="bg-richblack-800 rounded-lg p-4 border border-richblack-700 hover:border-yellow-50 transition-all">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{tip.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                  <p className="text-richblack-300 mb-3">{tip.description}</p>
                  
                  <div className="mt-2">
                    <h4 className="text-yellow-50 text-sm font-medium mb-1">Recommended Resources:</h4>
                    <ul className="list-disc list-inside text-sm text-richblack-300">
                      {tip.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Pathways */}
      <div>
        <h2 className="text-xl font-bold mb-4">Learning Pathways</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.learningPathways.map((pathway, index) => (
            <div key={index} className="bg-richblack-800 rounded-lg p-4 border border-richblack-700 hover:border-yellow-50 transition-all">
              <h3 className="text-lg font-semibold mb-3 text-yellow-50">{pathway.title} Path</h3>
              
              <div className="mb-3">
                <h4 className="text-richblack-5 font-medium mb-2">Recommended Courses:</h4>
                <ul className="list-disc list-inside text-sm text-richblack-300">
                  {pathway.courses.map((course, courseIndex) => (
                    <li key={courseIndex}>{course}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-richblack-5 font-medium mb-2">Skills You'll Gain:</h4>
                <div className="flex flex-wrap gap-2">
                  {pathway.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="bg-richblack-700 text-xs px-2 py-1 rounded-full text-richblack-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/dashboard/course-catalog"
                className="mt-4 block text-center w-full py-2 bg-richblack-700 text-yellow-50 rounded-md font-medium hover:bg-richblack-600 transition-all"
              >
                Explore This Path
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}