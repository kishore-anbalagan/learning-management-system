import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiClock, FiVideo, FiBook, FiAward, FiUser } from "react-icons/fi"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img';

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  return (
    <div 
      className='hover:scale-[1.03] transition-all duration-200 z-50 bg-richblack-800 rounded-xl overflow-hidden shadow-md border border-richblack-700'
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <Link to="/login">
        <div className="relative">
          <div className="rounded-t-lg">
            <Img
              src={course?.thumbnail}
              alt="course thumbnail"
              className={`${Height || 'h-48'} w-full object-cover`}
            />
            {/* Category Tag */}
            <div className="absolute top-2 right-2 bg-richblack-900 bg-opacity-60 px-2 py-1 rounded-full">
              <span className="text-xs text-yellow-50">
                {course?.category?.name || 'General'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-xl text-richblack-5 font-semibold mb-1">{course?.courseName}</p>
            
            {/* Course Description - shows on hover */}
            <div className={`transition-all duration-300 overflow-hidden ${showDetails ? 'max-h-20 mb-2' : 'max-h-0'}`}>
              <p className="text-sm text-richblack-300 line-clamp-2">
                {course?.courseDescription || 'Learn exciting new skills with this comprehensive course.'}
              </p>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <FiUser className="text-richblack-300" />
              <p className="text-sm text-richblack-50">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400 text-xs">
                ({course?.ratingAndReviews?.length || 0} ratings)
              </span>
            </div>
            
            {/* Course Details - shows on hover */}
            <div className={`grid grid-cols-2 gap-2 text-xs text-richblack-300 mb-2 transition-all duration-300 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-1">
                <FiClock />
                <span>{course?.duration || '10 hours'}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiVideo />
                <span>{course?.totalLectures || '42'} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <FiBook />
                <span>{course?.level || 'Beginner'}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiAward />
                <span>{course?.language || 'English'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xl text-yellow-50 font-bold">₹{course?.price}</p>
              <span className="text-xs text-richblack-300 bg-richblack-700 px-2 py-1 rounded-full">
                {showDetails ? 'View Details' : 'Enroll Now'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card
