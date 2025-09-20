import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import { hasCourseAccess } from '../../../utils/courseAccessUtils';
import { shouldHaveStudentAccess } from '../../../utils/accessOverrides';

// This will be replaced with actual API calls
const fetchCourseContent = async (courseId, token) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: '1',
        courseName: 'Introduction to Web Development',
        courseDescription: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        instructor: {
          _id: 'i1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          image: 'https://placehold.co/200'
        },
        thumbnail: 'https://placehold.co/600x400',
        sections: [
          {
            _id: 'section1',
            sectionName: 'Getting Started with HTML',
            completed: true,
            subSections: [
              {
                _id: 'sub1',
                title: 'Introduction to HTML',
                description: 'Learn about HTML tags and structure',
                videoUrl: 'https://example.com/video1',
                duration: '10:25',
                completed: true
              },
              {
                _id: 'sub2',
                title: 'HTML Forms and Inputs',
                description: 'Learn to create interactive forms',
                videoUrl: 'https://example.com/video2',
                duration: '15:30',
                completed: true
              }
            ]
          },
          {
            _id: 'section2',
            sectionName: 'CSS Fundamentals',
            completed: false,
            subSections: [
              {
                _id: 'sub3',
                title: 'Introduction to CSS',
                description: 'Learn about CSS selectors and properties',
                videoUrl: 'https://example.com/video3',
                duration: '12:45',
                completed: true
              },
              {
                _id: 'sub4',
                title: 'CSS Layouts',
                description: 'Learn about Flexbox and Grid',
                videoUrl: 'https://example.com/video4',
                duration: '18:20',
                completed: false
              }
            ]
          },
          {
            _id: 'section3',
            sectionName: 'JavaScript Basics',
            completed: false,
            subSections: [
              {
                _id: 'sub5',
                title: 'Introduction to JavaScript',
                description: 'Learn about JavaScript syntax and variables',
                videoUrl: 'https://example.com/video5',
                duration: '14:30',
                completed: false
              },
              {
                _id: 'sub6',
                title: 'DOM Manipulation',
                description: 'Learn how to interact with the DOM',
                videoUrl: 'https://example.com/video6',
                duration: '20:15',
                completed: false
              }
            ]
          }
        ],
        progress: 50, // percentage
        totalDuration: '91:45',
        completedDuration: '38:40'
      });
    }, 1000);
  });
};

// This will be replaced with actual API call
const markAsCompleted = async (courseId, subSectionId, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export default function ViewCourse() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Always allow access to course content for all users
        console.log("Fetching course content with universal access enabled");
        const data = await fetchCourseContent(courseId, token);
        setCourseData(data);
        
        // Initialize expanded sections
        const initialExpanded = {};
        data.sections.forEach(section => {
          initialExpanded[section._id] = false;
        });
        
        // Set first section to expanded by default
        if (data.sections.length > 0) {
          initialExpanded[data.sections[0]._id] = true;
        }
        
        setExpandedSections(initialExpanded);
        
        // Set first incomplete video as active by default
        let foundActive = false;
        for (const section of data.sections) {
          for (const subSection of section.subSections) {
            if (!subSection.completed) {
              setActiveVideo(subSection);
              foundActive = true;
              break;
            }
          }
          if (foundActive) break;
        }
        
        // If all videos are completed, set the first one as active
        if (!foundActive && data.sections.length > 0 && data.sections[0].subSections.length > 0) {
          setActiveVideo(data.sections[0].subSections[0]);
        }
      } catch (error) {
        console.error('Error fetching course content:', error);
        toast.error('Failed to fetch course content');
      } finally {
        setLoading(false);
      }
    };

    // Ensure all users have access to the course content
    if (shouldHaveStudentAccess(null) || hasCourseAccess(null, courseId)) {
      fetchData();
    }
  }, [courseId, token]);

  const toggleSection = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId],
    });
  };

  const handleVideoSelect = (subSection) => {
    setActiveVideo(subSection);
  };

  const handleMarkAsCompleted = async (subSectionId) => {
    try {
      await markAsCompleted(courseId, subSectionId, token);
      
      // Update local state
      setCourseData(prevData => {
        const updatedSections = prevData.sections.map(section => {
          const updatedSubSections = section.subSections.map(subSection => {
            if (subSection._id === subSectionId) {
              return { ...subSection, completed: true };
            }
            return subSection;
          });
          
          // Check if all subsections are completed to mark section as completed
          const allCompleted = updatedSubSections.every(sub => sub.completed);
          
          return {
            ...section,
            subSections: updatedSubSections,
            completed: allCompleted
          };
        });
        
        // Calculate new progress
        const totalSubSections = prevData.sections.reduce(
          (total, section) => total + section.subSections.length, 0
        );
        const completedSubSections = updatedSections.reduce(
          (total, section) => total + section.subSections.filter(sub => sub.completed).length, 0
        );
        const newProgress = Math.round((completedSubSections / totalSubSections) * 100);
        
        return {
          ...prevData,
          sections: updatedSections,
          progress: newProgress
        };
      });
      
      toast.success('Marked as completed');
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast.error('Failed to update progress');
    }
  };

  const calculateSectionProgress = (section) => {
    if (!section.subSections.length) return 0;
    const completedCount = section.subSections.filter(sub => sub.completed).length;
    return Math.round((completedCount / section.subSections.length) * 100);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!courseData) {
    return (
      <div className="text-center py-10">
        <p className="text-richblack-5 text-xl mb-2">No data available</p>
        <p className="text-richblack-300">Try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side: Course Content */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="bg-richblack-800 rounded-lg border border-richblack-700 overflow-hidden h-full flex flex-col">
          <div className="p-4 bg-richblack-700">
            <Link
              to="/dashboard/enrolled-courses"
              className="flex items-center text-richblack-300 hover:text-richblack-50 mb-4"
            >
              <FiArrowLeft className="mr-2" /> Back to Courses
            </Link>
            <h2 className="text-xl font-bold text-richblack-5 mb-1">
              {courseData.courseName}
            </h2>
            <div className="flex items-center mb-4">
              <div className="bg-yellow-50 h-2 rounded-full overflow-hidden w-full max-w-[200px] mr-3">
                <div
                  className="bg-yellow-100 h-full"
                  style={{ width: `${courseData.progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-richblack-300">
                {courseData.progress}% Complete
              </span>
            </div>
          </div>

          <div className="overflow-auto flex-grow">
            {courseData.sections.map((section) => (
              <div key={section._id} className="border-b border-richblack-700 last:border-b-0">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section._id)}
                  className="w-full text-left p-4 hover:bg-richblack-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {expandedSections[section._id] ? (
                        <FiChevronUp className="text-richblack-300 mr-2" />
                      ) : (
                        <FiChevronDown className="text-richblack-300 mr-2" />
                      )}
                      <div>
                        <h3 className="font-medium text-richblack-5">
                          {section.sectionName}
                        </h3>
                        <p className="text-sm text-richblack-300">
                          {section.subSections.filter(sub => sub.completed).length} / {section.subSections.length} | {calculateSectionProgress(section)}%
                        </p>
                      </div>
                    </div>
                    {section.completed ? (
                      <FiCheckCircle className="text-caribbeangreen-300" />
                    ) : (
                      <FiClock className="text-yellow-50" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                {expandedSections[section._id] && (
                  <div className="pl-10 pr-4 pb-2">
                    {section.subSections.map((subSection) => (
                      <button
                        key={subSection._id}
                        onClick={() => handleVideoSelect(subSection)}
                        className={`w-full text-left p-3 rounded-md mb-2 flex items-start ${
                          activeVideo && activeVideo._id === subSection._id
                            ? "bg-richblack-700"
                            : "hover:bg-richblack-700"
                        } transition-colors`}
                      >
                        <div className="mt-1 mr-3">
                          {subSection.completed ? (
                            <FiCheckCircle className="text-caribbeangreen-300" />
                          ) : (
                            <FiCircle className="text-richblack-300" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col items-start">
                          <h4 className={`font-medium ${
                            activeVideo && activeVideo._id === subSection._id
                              ? "text-yellow-50"
                              : "text-richblack-5"
                          }`}>
                            {subSection.title}
                          </h4>
                          <div className="flex items-center text-xs text-richblack-300 mt-1">
                            <FiClock className="mr-1" />
                            <span>{subSection.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Video Player */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        {activeVideo ? (
          <div className="bg-richblack-800 rounded-lg border border-richblack-700 overflow-hidden h-full flex flex-col">
            {/* Video Player */}
            <div className="relative bg-richblack-900 aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://placehold.co/800x450" 
                  alt="Video Placeholder" 
                  className="max-w-full max-h-full object-contain"
                />
                <p className="absolute text-white bg-richblack-900 bg-opacity-80 p-2 rounded">
                  Video Player Placeholder
                </p>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-richblack-5">
                  {activeVideo.title}
                </h2>
                {!activeVideo.completed && (
                  <button
                    onClick={() => handleMarkAsCompleted(activeVideo._id)}
                    className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
              <p className="text-richblack-300 mb-6">
                {activeVideo.description}
              </p>

              <div className="border-t border-richblack-700 pt-6">
                <h3 className="text-lg font-semibold text-richblack-5 mb-4">
                  About this course
                </h3>
                <p className="text-richblack-300 mb-4">
                  {courseData.courseDescription}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={courseData.instructor.image}
                      alt={`${courseData.instructor.firstName} ${courseData.instructor.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-richblack-5">
                      {courseData.instructor.firstName} {courseData.instructor.lastName}
                    </p>
                    <p className="text-sm text-richblack-300">Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-8 flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-richblack-5 text-xl mb-2">
                No video selected
              </p>
              <p className="text-richblack-300">
                Select a lecture from the course content to start learning
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side: Course Content Skeleton */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="bg-richblack-800 rounded-lg border border-richblack-700 overflow-hidden h-full">
          <div className="p-4 bg-richblack-700">
            <div className="h-4 w-32 bg-richblack-600 rounded mb-4 animate-pulse"></div>
            <div className="h-6 w-48 bg-richblack-600 rounded mb-2 animate-pulse"></div>
            <div className="flex items-center mb-4">
              <div className="bg-richblack-600 h-2 rounded-full overflow-hidden w-full max-w-[200px] mr-3 animate-pulse"></div>
              <div className="h-4 w-16 bg-richblack-600 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="overflow-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-richblack-700">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-richblack-600 rounded-full mr-2 animate-pulse"></div>
                      <div>
                        <div className="h-5 w-40 bg-richblack-600 rounded mb-2 animate-pulse"></div>
                        <div className="h-3 w-24 bg-richblack-600 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-richblack-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Video Player Skeleton */}
      <div className="lg:col-span-2 order-1 lg:order-2">
        <div className="bg-richblack-800 rounded-lg border border-richblack-700 overflow-hidden h-full">
          {/* Video Player Skeleton */}
          <div className="bg-richblack-900 aspect-video animate-pulse"></div>

          {/* Video Info Skeleton */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="h-8 w-64 bg-richblack-700 rounded animate-pulse"></div>
              <div className="h-10 w-40 bg-richblack-700 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-full bg-richblack-700 rounded mb-3 animate-pulse"></div>
            <div className="h-4 w-5/6 bg-richblack-700 rounded mb-6 animate-pulse"></div>

            <div className="border-t border-richblack-700 pt-6">
              <div className="h-6 w-48 bg-richblack-700 rounded mb-4 animate-pulse"></div>
              <div className="h-4 w-full bg-richblack-700 rounded mb-3 animate-pulse"></div>
              <div className="h-4 w-2/3 bg-richblack-700 rounded mb-4 animate-pulse"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-richblack-700 mr-3 animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-richblack-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 w-20 bg-richblack-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}