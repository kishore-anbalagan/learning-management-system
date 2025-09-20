import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BiArrowBack, BiBookOpen, BiTime, BiUser, BiCalendar, BiRocket } from 'react-icons/bi';
import { FiClock, FiVideo, FiAward, FiBarChart2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import RatingStars from '../components/common/RatingStars';
import Loading from '../components/common/Loading';
import Footer from '../components/common/Footer';
import { enrollInCourse, isEnrolledInCourse } from '../utils/enrolledCoursesManager';

// Mock data for specific course details - this would come from API
const courseDetailsData = {
  // Flutter course details
  '8': {
    _id: '8',
    courseName: 'Flutter Mobile Development',
    courseDescription: 'Build beautiful cross-platform mobile apps with Flutter and Dart. Learn UI design, state management, API integration, and how to publish your apps to both iOS and Android app stores.',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1682090786689-741d60a11384?auto=format&fit=crop&q=80&w=1200',
    instructor: { 
      firstName: 'Lisa', 
      lastName: 'Wong',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      bio: 'Senior Mobile Developer with 8+ years of experience. Previously worked at Google and several startups. Passionate about creating intuitive mobile experiences.'
    },
    category: { name: 'Mobile Development' },
    price: 2899,
    averageRating: 4.6,
    ratingCount: 143,
    tags: ['flutter', 'dart', 'mobile', 'cross-platform'],
    totalLectures: 42,
    totalDuration: '12 hours 30 minutes',
    language: 'English',
    level: 'Intermediate',
    lastUpdated: '2023-08-15',
    whatYouWillLearn: [
      'Build beautiful UI with Flutter widgets and Material Design',
      'Understand Flutter architecture and state management',
      'Implement Firebase authentication and cloud storage',
      'Connect to REST APIs and handle JSON data',
      'Create animations and custom UI components',
      'Test, debug and deploy your apps to both iOS and Android stores'
    ],
    prerequisites: [
      'Basic programming knowledge in any language',
      'Understanding of object-oriented programming',
      'Familiarity with mobile app concepts is helpful but not required'
    ],
    sections: [
      {
        title: 'Getting Started with Flutter',
        lectures: [
          { title: 'Introduction to Flutter and Dart', duration: '12:30' },
          { title: 'Setting up the development environment', duration: '18:45' },
          { title: 'Your first Flutter app', duration: '24:10' }
        ]
      },
      {
        title: 'Flutter UI Fundamentals',
        lectures: [
          { title: 'Understanding Widgets', duration: '20:15' },
          { title: 'Layout Widgets and Constraints', duration: '25:30' },
          { title: 'Working with Material Design', duration: '19:45' },
          { title: 'Creating Custom UI Components', duration: '28:20' }
        ]
      },
      {
        title: 'State Management',
        lectures: [
          { title: 'StatefulWidget vs StatelessWidget', duration: '15:45' },
          { title: 'Provider State Management', duration: '22:10' },
          { title: 'BLoC Pattern Introduction', duration: '24:30' }
        ]
      },
      {
        title: 'Working with APIs',
        lectures: [
          { title: 'HTTP Requests in Flutter', duration: '18:20' },
          { title: 'JSON Serialization', duration: '16:45' },
          { title: 'Building a Weather App', duration: '32:15' }
        ]
      }
    ]
  },
  // JavaScript course details
  '1': {
    _id: '1',
    courseName: 'JavaScript for Beginners',
    courseDescription: 'Start your journey with JavaScript, the most popular programming language for web development. Learn core concepts, DOM manipulation, asynchronous programming, and build real-world projects.',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1200',
    instructor: { 
      firstName: 'Sarah', 
      lastName: 'Johnson',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      bio: 'Frontend developer with 10+ years of experience. JavaScript enthusiast and educational content creator.'
    },
    category: { name: 'Programming' },
    price: 1999,
    averageRating: 4.7,
    ratingCount: 128,
    tags: ['javascript', 'frontend', 'web development'],
    totalLectures: 35,
    totalDuration: '10 hours 45 minutes',
    language: 'English',
    level: 'Beginner',
    lastUpdated: '2023-07-12',
    whatYouWillLearn: [
      'JavaScript fundamentals and syntax',
      'DOM manipulation and event handling',
      'Asynchronous programming with Promises and async/await',
      'Working with APIs and fetch',
      'ES6+ features and modern JavaScript',
      'Build 3 real-world projects from scratch'
    ],
    prerequisites: [
      'Basic HTML and CSS knowledge',
      'No prior JavaScript experience required',
      'A code editor (VS Code recommended)'
    ],
    sections: [
      {
        title: 'JavaScript Fundamentals',
        lectures: [
          { title: 'Introduction to JavaScript', duration: '15:30' },
          { title: 'Variables and Data Types', duration: '22:15' },
          { title: 'Operators and Expressions', duration: '18:45' }
        ]
      },
      {
        title: 'Control Flow',
        lectures: [
          { title: 'Conditional Statements', duration: '20:10' },
          { title: 'Loops and Iterations', duration: '25:30' },
          { title: 'Functions and Scope', duration: '28:15' }
        ]
      },
      {
        title: 'DOM Manipulation',
        lectures: [
          { title: 'Selecting DOM Elements', duration: '16:45' },
          { title: 'Modifying the DOM', duration: '19:30' },
          { title: 'Event Handling', duration: '24:20' }
        ]
      },
      {
        title: 'Asynchronous JavaScript',
        lectures: [
          { title: 'Callbacks and Promises', duration: '26:15' },
          { title: 'Async/Await', duration: '22:30' },
          { title: 'Fetching Data from APIs', duration: '28:45' }
        ]
      }
    ]
  }
};

// This would be your API call
const fetchCourseDetails = async (courseId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(courseDetailsData[courseId] || null);
    }, 1000);
  });
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseDetails(courseId);
        if (data) {
          setCourseDetails(data);
          // Check if already enrolled
          setIsEnrolled(isEnrolledInCourse(courseId));
        } else {
          // If course not found, could navigate to 404 or course catalog
          navigate('/dashboard/course-catalog');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    getCourseDetails();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [courseId, navigate]);

  const toggleSection = (index) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const handleEnroll = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    
    try {
      // Simulate API call for enrolling in a course
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
      
      if (response.success) {
        // Save enrollment in localStorage
        const enrolled = enrollInCourse(courseId);
        
        if (enrolled) {
          toast.success('Successfully enrolled in the course!');
          setIsEnrolled(true);
          // Navigate to enrolled courses page
          navigate('/dashboard/enrolled-courses');
        } else {
          toast.error('Error enrolling in course');
        }
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-richblack-900 text-richblack-5">
      {/* Course Header */}
      <div className="bg-richblack-800 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-richblack-300 hover:text-yellow-50 mb-6"
          >
            <BiArrowBack className="mr-2" /> Back
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{courseDetails.courseName}</h1>
              <p className="text-richblack-300 text-lg mb-6">{courseDetails.courseDescription}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-yellow-50 font-semibold">{courseDetails.averageRating.toFixed(1)}</span>
                <RatingStars Review_Count={courseDetails.averageRating} />
                <span className="text-richblack-300">({courseDetails.ratingCount} ratings)</span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={courseDetails.instructor.image} 
                  alt={`${courseDetails.instructor.firstName} ${courseDetails.instructor.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>Created by <span className="font-semibold">{courseDetails.instructor.firstName} {courseDetails.instructor.lastName}</span></span>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-richblack-300 mb-6">
                <div className="flex items-center gap-2">
                  <BiCalendar /> Last updated: {courseDetails.lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <BiRocket /> {courseDetails.level}
                </div>
                <div className="flex items-center gap-2">
                  <BiUser /> {courseDetails.language}
                </div>
              </div>
            </div>
            
            <div className="bg-richblack-700 rounded-lg overflow-hidden shadow-lg">
              <div className="relative">
                <img 
                  src={courseDetails.thumbnail} 
                  alt={courseDetails.courseName} 
                  className="w-full h-48 md:h-60 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <div className="bg-black bg-opacity-60 p-4 rounded-full">
                    <FiVideo className="text-yellow-50 text-3xl" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-3xl font-bold mb-6">₹{courseDetails.price}</div>
                
                {isEnrolled ? (
                  <Link 
                    to="/dashboard/enrolled-courses"
                    className="block w-full py-3 bg-caribbeangreen-200 text-richblack-900 font-semibold rounded-md hover:bg-caribbeangreen-100 transition-all mb-4 text-center"
                  >
                    Go to Course
                  </Link>
                ) : (
                  <button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`w-full py-3 font-semibold rounded-md transition-all mb-4 ${
                      enrolling 
                        ? "bg-richblack-700 text-richblack-300" 
                        : "bg-yellow-50 text-richblack-900 hover:bg-yellow-100"
                    }`}
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}
                
                <div className="border-t border-richblack-600 pt-4 mt-4">
                  <h3 className="font-semibold mb-4 text-lg">This course includes:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiVideo className="text-richblack-300" />
                      <span>{courseDetails.totalLectures} lectures</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiClock className="text-richblack-300" />
                      <span>{courseDetails.totalDuration} total duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiBarChart2 className="text-richblack-300" />
                      <span>{courseDetails.level} level</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiAward className="text-richblack-300" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="bg-richblack-800 p-6 rounded-lg mb-8 border border-richblack-700">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseDetails.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="text-yellow-50 mt-1">✓</div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prerequisites */}
            <div className="bg-richblack-800 p-6 rounded-lg mb-8 border border-richblack-700">
              <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
              <ul className="list-disc pl-5 space-y-2">
                {courseDetails.prerequisites.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Course Content */}
            <div className="bg-richblack-800 p-6 rounded-lg mb-8 border border-richblack-700">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="flex justify-between items-center mb-4">
                <div className="text-richblack-300">
                  {courseDetails.sections.length} sections • {courseDetails.totalLectures} lectures • {courseDetails.totalDuration} total
                </div>
                <button 
                  className="text-yellow-50 text-sm hover:underline"
                  onClick={() => setExpandedSections(expandedSections.length ? [] : courseDetails.sections.map((_, i) => i))}
                >
                  {expandedSections.length ? 'Collapse All' : 'Expand All'}
                </button>
              </div>
              
              <div className="space-y-4">
                {courseDetails.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-richblack-700 rounded-md overflow-hidden">
                    <button 
                      className="flex justify-between items-center w-full p-4 bg-richblack-700 hover:bg-richblack-600 transition-all text-left"
                      onClick={() => toggleSection(sectionIndex)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-richblack-300 text-sm">
                        <span>{section.lectures.length} lectures</span>
                        <span className="transform transition-transform duration-200" style={{ transform: expandedSections.includes(sectionIndex) ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ▼
                        </span>
                      </div>
                    </button>
                    
                    {expandedSections.includes(sectionIndex) && (
                      <div className="bg-richblack-800">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <div 
                            key={lectureIndex} 
                            className="flex justify-between items-center p-4 hover:bg-richblack-700 transition-all border-t border-richblack-700"
                          >
                            <div className="flex items-center gap-3">
                              <FiVideo className="text-richblack-300" />
                              <span>{lecture.title}</span>
                            </div>
                            <span className="text-richblack-300 text-sm">{lecture.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Instructor */}
            <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <img 
                  src={courseDetails.instructor.image} 
                  alt={`${courseDetails.instructor.firstName} ${courseDetails.instructor.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{courseDetails.instructor.firstName} {courseDetails.instructor.lastName}</h3>
                  <p className="text-richblack-300 mt-2">{courseDetails.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:block hidden">
            <div className="sticky top-20">
              <div className="bg-richblack-800 p-6 rounded-lg mb-6 border border-richblack-700">
                <h3 className="font-semibold mb-4 text-lg">Course tags</h3>
                <div className="flex flex-wrap gap-2">
                  {courseDetails.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-richblack-700 text-richblack-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700">
                <h3 className="font-semibold mb-4 text-lg">Share this course</h3>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-richblack-700 rounded-full flex items-center justify-center hover:bg-richblack-600 transition-all">
                    <i className="text-richblack-50">f</i>
                  </button>
                  <button className="w-10 h-10 bg-richblack-700 rounded-full flex items-center justify-center hover:bg-richblack-600 transition-all">
                    <i className="text-richblack-50">t</i>
                  </button>
                  <button className="w-10 h-10 bg-richblack-700 rounded-full flex items-center justify-center hover:bg-richblack-600 transition-all">
                    <i className="text-richblack-50">in</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}