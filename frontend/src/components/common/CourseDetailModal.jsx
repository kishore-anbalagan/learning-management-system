import React, { useEffect, useState } from 'react';
import { FiX, FiClock, FiCalendar, FiUser, FiBookOpen, FiTag } from 'react-icons/fi';
import Loading from './Loading';
import RatingStars from './RatingStars';
import { Link } from 'react-router-dom';

const CourseDetailModal = ({ course, onClose, onEnroll, isEnrolled, enrolling }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Animation effect - fade in
    setIsOpen(true);
    
    // Add body scroll lock
    document.body.style.overflow = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Calculate total duration
  const calculateTotalDuration = () => {
    if (!course.courseContent) return "N/A";
    
    let totalDurationInSeconds = 0;
    course.courseContent.forEach(section => {
      if (section.subSection) {
        section.subSection.forEach(subsection => {
          totalDurationInSeconds += parseInt(subsection.timeDuration || 0);
        });
      }
    });
    
    // Format duration
    const hours = Math.floor(totalDurationInSeconds / 3600);
    const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-richblack-800 text-white shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-10'
        }`}
      >
        {/* Close button */}
        <button 
          className="absolute right-4 top-4 text-white z-10 p-2 rounded-full bg-richblack-700 hover:bg-richblack-600"
          onClick={handleClose}
        >
          <FiX size={24} />
        </button>
        
        {!course ? (
          <div className="p-6 flex items-center justify-center min-h-[300px]">
            <Loading />
          </div>
        ) : (
          <>
            {/* Course Image */}
            <div className="relative w-full h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-richblack-800 to-transparent z-[1]"></div>
              <img 
                src={course.thumbnail || "https://via.placeholder.com/800x300?text=No+Image"} 
                alt={course.courseName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-6 z-[2]">
                <h1 className="text-3xl font-bold text-white mb-2">{course.courseName}</h1>
                {course.instructor && (
                  <p className="text-richblack-300 flex items-center">
                    <FiUser className="mr-2" />
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {/* Rating and Category */}
              <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex items-center mb-2 sm:mb-0">
                  <RatingStars Review={course.ratingAndReviews?.length > 0 ? course.averageRating || 4.5 : 0} Star={5} />
                  <span className="ml-2 text-richblack-300">
                    ({course.ratingAndReviews?.length || 0} reviews)
                  </span>
                </div>
                {course.category && (
                  <div className="bg-richblack-700 py-1 px-3 rounded-full text-sm">
                    {course.category.name || course.category}
                  </div>
                )}
              </div>
              
              {/* Course Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-richblack-50">About this course</h2>
                <p className="text-richblack-300 leading-relaxed">
                  {course.courseDescription}
                </p>
              </div>
              
              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <FiClock className="text-yellow-50 text-lg mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-richblack-50">Duration</h3>
                    <p className="text-richblack-300">{course.totalDuration || calculateTotalDuration()}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiBookOpen className="text-yellow-50 text-lg mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-richblack-50">Lectures</h3>
                    <p className="text-richblack-300">
                      {course.courseContent?.reduce((acc, section) => acc + (section.subSection?.length || 0), 0) || 'N/A'} lectures
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiCalendar className="text-yellow-50 text-lg mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-richblack-50">Created On</h3>
                    <p className="text-richblack-300">{formatDate(course.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiTag className="text-yellow-50 text-lg mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-richblack-50">Price</h3>
                    <p className="text-yellow-50 font-semibold">₹{course.price}</p>
                  </div>
                </div>
              </div>
              
              {/* What you'll learn */}
              {course.whatYouWillLearn && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-richblack-50">What you'll learn</h2>
                  <p className="text-richblack-300 leading-relaxed">
                    {course.whatYouWillLearn}
                  </p>
                </div>
              )}
              
              {/* Course Content Summary */}
              {course.courseContent && course.courseContent.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-richblack-50">Course Content</h2>
                  <div className="border border-richblack-700 rounded-lg overflow-hidden">
                    {course.courseContent.map((section, index) => (
                      <div 
                        key={section._id || index}
                        className="border-b border-richblack-700 last:border-b-0"
                      >
                        <div className="bg-richblack-700 bg-opacity-30 p-4">
                          <h3 className="font-medium text-richblack-50">{section.sectionName}</h3>
                          <p className="text-sm text-richblack-300">
                            {section.subSection?.length || 0} lectures
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm uppercase tracking-wider mb-2 text-richblack-400">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-richblack-700 text-richblack-200 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                {isEnrolled ? (
                  <Link
                    to="/dashboard/enrolled-courses"
                    className="flex-1 text-center py-3 px-4 rounded-md font-semibold bg-caribbeangreen-200 text-richblack-900 hover:bg-caribbeangreen-100 transition-all"
                  >
                    Go to Course
                  </Link>
                ) : (
                  <button
                    onClick={() => onEnroll(course._id)}
                    disabled={enrolling}
                    className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                      enrolling
                        ? "bg-richblack-500 text-richblack-300 cursor-not-allowed"
                        : "bg-yellow-50 text-richblack-900 hover:bg-yellow-100"
                    }`}
                  >
                    {enrolling ? "Enrolling..." : `Enroll for ₹${course.price}`}
                  </button>
                )}
                
                <Link 
                  to={`/course-details/${course._id}`}
                  className="flex-1 text-center py-3 px-4 rounded-md font-semibold border border-yellow-50 text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900 transition-all"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetailModal;