import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiClock, FiUser } from 'react-icons/fi';

const CourseCard = ({ course, handleUnenroll, isUnenrolling }) => {
  // Format the instructor name
  const instructorName = course.instructor 
    ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() 
    : 'Unknown Instructor';
  
  // Calculate time to complete based on total lessons (just an estimate)
  const timeToComplete = course.totalLessons ? `${Math.ceil(course.totalLessons / 3)} hours` : 'Unknown';
  
  return (
    <div className="bg-richblack-700 rounded-lg overflow-hidden flex flex-col">
      {/* Course Thumbnail */}
      <div className="relative h-40">
        <img 
          src={course.thumbnail || 'https://via.placeholder.com/500x300?text=No+Image'} 
          alt={course.courseName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-richblack-900 to-transparent p-4">
          <div className="text-sm text-yellow-50 bg-yellow-900 bg-opacity-50 px-2 py-1 rounded-full inline-block">
            {course.category?.name || 'General'}
          </div>
        </div>
      </div>
      
      {/* Course Info */}
      <div className="p-4 flex-grow">
        <h3 className="text-richblack-5 font-medium text-lg mb-2 line-clamp-1">{course.courseName}</h3>
        <p className="text-sm text-richblack-300 mb-3 line-clamp-2">{course.courseDescription}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-xs text-richblack-300">
            <FiUser className="mr-1" />
            {instructorName}
          </div>
          <div className="flex items-center text-xs text-richblack-300">
            <FiClock className="mr-1" />
            {timeToComplete}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-richblack-300">Progress</span>
            <span className="text-xs text-yellow-50">{course.progress || 0}%</span>
          </div>
          <div className="w-full bg-richblack-600 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-yellow-50 h-full rounded-full" 
              style={{ width: `${course.progress || 0}%` }}
            ></div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link 
            to={`/dashboard/view-course/${course._id}`}
            className="flex-1 text-center bg-yellow-50 text-richblack-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-yellow-100 transition-colors"
          >
            Continue
          </Link>
          
          <button
            onClick={() => handleUnenroll(course._id)}
            disabled={isUnenrolling}
            className="bg-richblack-600 text-richblack-50 py-2 px-3 rounded-md text-sm hover:bg-richblack-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUnenrolling ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;