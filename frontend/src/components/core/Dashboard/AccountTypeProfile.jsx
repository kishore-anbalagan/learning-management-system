import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit, FiBook, FiUsers, FiStar } from 'react-icons/fi';

// Import the standard MyProfile component
import MyProfile from './MyProfile';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { getInstructorData } from '../../../services/operations/profileAPI';

export default function AccountTypeProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [instructorData, setInstructorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get account type from localStorage, with fallback to user profile data
  const selectedAccountType = localStorage.getItem("selectedAccountType") || user?.accountType;
  
  useEffect(() => {
    // Only fetch instructor data if user is an instructor
    if (selectedAccountType === ACCOUNT_TYPE.INSTRUCTOR && token) {
      fetchInstructorData();
    }
  }, [selectedAccountType, token]);
  
  const fetchInstructorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInstructorData(token);
      console.log("Instructor data fetched:", data);
      
      // If data is an array (courses), store it directly
      if (Array.isArray(data)) {
        setInstructorData(data);
      } 
      // If data has a courses property, use that
      else if (data && data.courses) {
        setInstructorData(data.courses);
      }
      // Otherwise, just store whatever we got
      else {
        setInstructorData(data);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      setError("Could not load instructor data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // If not an instructor, just show the standard MyProfile component
  if (selectedAccountType !== ACCOUNT_TYPE.INSTRUCTOR) {
    return <MyProfile />;
  }
  
  // Helper function to safely get counts from instructor data
  const getInstructorCounts = () => {
    // Default values for empty/null data
    const defaults = { courseCount: 0, studentCount: 0, avgRating: "N/A" };
    
    // Handle case where data is null or undefined
    if (!instructorData) return defaults;
    
    // Handle array of courses
    if (Array.isArray(instructorData)) {
      const courseCount = instructorData.length;
      const studentCount = instructorData.reduce(
        (acc, course) => acc + (course.studentsEnrolled?.length || 0), 
        0
      );
      
      let avgRating = "N/A";
      if (courseCount > 0) {
        const totalRating = instructorData.reduce((acc, course) => {
          if (!course.ratingAndReviews?.length) return acc;
          const courseAvg = course.ratingAndReviews.reduce(
            (sum, review) => sum + (review.rating || 0), 
            0
          ) / course.ratingAndReviews.length;
          return acc + (isNaN(courseAvg) ? 0 : courseAvg);
        }, 0);
        
        avgRating = (totalRating / courseCount).toFixed(1);
        if (isNaN(avgRating)) avgRating = "N/A";
      }
      
      return { courseCount, studentCount, avgRating };
    }
    
    // Fallback for unexpected data formats
    return defaults;
  };
  
  // Get the counts
  const { courseCount, studentCount, avgRating } = getInstructorCounts();
  
  // If instructor, show MyProfile with additional instructor-specific information
  return (
    <div>
      {/* Regular MyProfile content */}
      <MyProfile />
      
      {/* Additional Instructor Information */}
      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-richblack-5">
            Instructor Information
          </h3>
        </div>
        
        {loading ? (
          <p className="text-richblack-300">Loading instructor data...</p>
        ) : error ? (
          <p className="text-pink-200">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-richblack-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiBook className="text-yellow-50 mr-2 text-xl" />
                <h4 className="text-richblack-5 font-medium">Courses Created</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-50">
                {courseCount}
              </p>
            </div>
            
            <div className="bg-richblack-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiUsers className="text-yellow-50 mr-2 text-xl" />
                <h4 className="text-richblack-5 font-medium">Total Students</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-50">
                {studentCount}
              </p>
            </div>
            
            <div className="bg-richblack-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiStar className="text-yellow-50 mr-2 text-xl" />
                <h4 className="text-richblack-5 font-medium">Average Rating</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-50">
                {avgRating}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}