import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';

function InstructorCourseCard({ course }) {
  // Safely handle null/undefined course objects
  if (!course) {
    console.error('InstructorCourseCard received undefined or null course');
    return null;
  }
  
  // For instructor view, we'll display student enrollment information
  // In a real app, this would come from the API, but we'll simulate it here
  const enrolledStudents = Math.floor(Math.random() * 100) + 5; // Random number between 5-104
  const completionRate = Math.floor(Math.random() * 60) + 40; // Random number between 40-99%
  const averageRating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0-5.0
  const revenueGenerated = Math.floor(Math.random() * 1000) + 100; // Random between $100-$1099
  
  // Safely handle missing category
  const categoryName = course.category?.name || 'Course';
  
  return (
    <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-50 hover:transform hover:scale-[1.01] transition-all duration-300 shadow-md">
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail || `https://placehold.co/500x300/222/444?text=${encodeURIComponent(categoryName)}`}
          alt={course.courseName || 'Course'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/500x300/222/444?text=Course";
          }}
        />
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-50 text-richblack-900 text-xs font-semibold px-2 py-1 rounded-full">
            {enrolledStudents} Students
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-richblack-900 to-transparent h-16"></div>
      </div>
      <div className="p-4">
        <h3 className="text-richblack-5 font-semibold text-lg line-clamp-1 hover:text-yellow-50 transition-colors">
          {course.courseName || 'Unnamed Course'}
        </h3>
        <p className="text-yellow-50 text-xs">{categoryName}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-richblack-900 p-2 rounded-md">
            <p className="text-xs text-richblack-300 mb-1">Completion Rate</p>
            <p className="text-sm text-yellow-50 font-semibold">{completionRate}%</p>
          </div>
          <div className="bg-richblack-900 p-2 rounded-md">
            <p className="text-xs text-richblack-300 mb-1">Avg. Rating</p>
            <p className="text-sm text-yellow-50 font-semibold">{averageRating}/5.0</p>
          </div>
          <div className="bg-richblack-900 p-2 rounded-md">
            <p className="text-xs text-richblack-300 mb-1">Revenue</p>
            <p className="text-sm text-yellow-50 font-semibold">${revenueGenerated}</p>
          </div>
          <div className="bg-richblack-900 p-2 rounded-md">
            <p className="text-xs text-richblack-300 mb-1">Students</p>
            <p className="text-sm text-yellow-50 font-semibold">{enrolledStudents}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {course._id && (
            <>
              <Link
                to={`/dashboard/enrolled-students`}
                className="flex-1 flex items-center justify-center border border-yellow-50 text-yellow-50 py-2 rounded-md font-semibold hover:bg-yellow-50 hover:text-richblack-900 transition-all"
              >
                View Students
              </Link>
              <Link
                to={`/dashboard/view-course/${course._id}`}
                className="flex-1 flex items-center justify-center bg-yellow-50 text-richblack-900 py-2 rounded-md font-semibold hover:bg-yellow-100 transition-all"
              >
                <FiBookOpen className="mr-2" />
                View Course
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorCourseCard;