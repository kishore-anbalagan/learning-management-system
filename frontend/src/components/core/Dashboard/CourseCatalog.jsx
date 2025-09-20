import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { enrollInCourse, isEnrolledInCourse } from '../../../utils/enrolledCoursesManager';

// Placeholder course images for different categories
const categoryImages = {
  'Programming': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=500',
  'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=500',
  'Database': 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=80&w=500',
  'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=500',
  'Backend Development': 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?auto=format&fit=crop&q=80&w=500',
  'Frontend Development': 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&q=80&w=500',
  'Mobile Development': 'https://images.unsplash.com/photo-1596742578443-7682ef7b7057?auto=format&fit=crop&q=80&w=500',
  'Flutter': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500',
  'DevOps': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=500',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500'
};

// Improved placeholder data with better thumbnails
const placeholderCourses = [
  {
    _id: '1',
    courseName: 'JavaScript for Beginners',
    courseDescription: 'Start your journey with JavaScript, the most popular programming language for web development',
    thumbnail: categoryImages['Programming'],
    instructor: { firstName: 'Sarah', lastName: 'Johnson' },
    category: { name: 'Programming' },
    price: 1999,
    averageRating: 4.7,
    ratingCount: 128,
    tags: ['javascript', 'frontend', 'web development']
  },
  {
    _id: '2',
    courseName: 'MongoDB Masterclass',
    courseDescription: 'Learn how to work with MongoDB, from basics to advanced techniques for modern database management',
    thumbnail: categoryImages['Database'],
    instructor: { firstName: 'Michael', lastName: 'Brown' },
    category: { name: 'Database' },
    price: 2499,
    averageRating: 4.5,
    ratingCount: 89,
    tags: ['mongodb', 'database', 'nosql']
  },
  {
    _id: '3',
    courseName: 'Node.js Backend Development',
    courseDescription: 'Build scalable and robust backend services with Node.js and Express framework',
    thumbnail: categoryImages['Backend Development'],
    instructor: { firstName: 'Emily', lastName: 'Clark' },
    category: { name: 'Backend Development' },
    price: 2999,
    averageRating: 4.9,
    ratingCount: 215,
    tags: ['nodejs', 'express', 'backend', 'api']
  },
  {
    _id: '4',
    courseName: 'UI/UX Design Principles',
    courseDescription: 'Master the fundamentals of UI/UX design to create beautiful and intuitive interfaces',
    thumbnail: categoryImages['Design'],
    instructor: { firstName: 'David', lastName: 'Wilson' },
    category: { name: 'Design' },
    price: 1799,
    averageRating: 4.6,
    ratingCount: 152,
    tags: ['ui', 'ux', 'design', 'figma']
  },
  {
    _id: '5',
    courseName: 'React.js Advanced Concepts',
    courseDescription: 'Take your React skills to the next level with advanced patterns and state management',
    thumbnail: categoryImages['Frontend Development'],
    instructor: { firstName: 'Jessica', lastName: 'Adams' },
    category: { name: 'Frontend Development' },
    price: 2799,
    averageRating: 4.8,
    ratingCount: 167,
    tags: ['react', 'redux', 'hooks', 'frontend']
  },
  {
    _id: '6',
    courseName: 'Python Data Science',
    courseDescription: 'Learn Python programming for data analysis, visualization, and machine learning',
    thumbnail: categoryImages['Data Science'],
    instructor: { firstName: 'Robert', lastName: 'Miller' },
    category: { name: 'Data Science' },
    price: 3299,
    averageRating: 4.7,
    ratingCount: 198,
    tags: ['python', 'data science', 'machine learning']
  },
  {
    _id: '7',
    courseName: 'DevOps for Developers',
    courseDescription: 'Master the essential DevOps tools and practices for continuous integration and deployment',
    thumbnail: categoryImages['DevOps'],
    instructor: { firstName: 'Thomas', lastName: 'Anderson' },
    category: { name: 'DevOps' },
    price: 2599,
    averageRating: 4.5,
    ratingCount: 112,
    tags: ['devops', 'docker', 'kubernetes', 'ci/cd']
  },
  {
    _id: '8',
    courseName: 'Flutter Mobile Development',
    courseDescription: 'Build beautiful cross-platform mobile apps with Flutter and Dart',
    thumbnail: 'https://plus.unsplash.com/premium_photo-1682090786689-741d60a11384?auto=format&fit=crop&q=80&w=500',
    instructor: { firstName: 'Lisa', lastName: 'Wong' },
    category: { name: 'Mobile Development' },
    price: 2899,
    averageRating: 4.6,
    ratingCount: 143,
    tags: ['flutter', 'dart', 'mobile', 'cross-platform']
  }
];

// This will be replaced with actual API calls when connected to backend
const fetchAvailableCourses = async (token) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(placeholderCourses);
    }, 1000);
  });
};

export default function CourseCatalog() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [enrolling, setEnrolling] = useState(null);
  const [searchFocus, setSearchFocus] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailableCourses(token);
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
        toast.error('Failed to fetch available courses');
      } finally {
        setLoading(false);
      }
    };

    getCourses();
    
    // This is a hacky way to force a refresh when the component is remounted
    // after enrollment, to ensure the UI updates correctly
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setCourses([...courses]);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token]);

  useEffect(() => {
    // Filter courses based on search term and active category
    let result = courses;
    
    if (searchTerm) {
      result = result.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeCategory !== 'All') {
      result = result.filter(course => course.category.name === activeCategory);
    }
    
    setFilteredCourses(result);
  }, [searchTerm, activeCategory, courses]);

  const handleEnroll = async (courseId) => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    setEnrolling(courseId);
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
      setEnrolling(null);
    }
  };

  // Extract unique categories
  const categories = ['All', ...new Set(courses.map(course => course.category.name))];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-richblack-5 mb-6">
        Course Catalog
      </h1>
      <p className="text-richblack-300 mb-8">
        Explore our wide range of courses and start learning today
      </p>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-300" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-richblack-700 text-richblack-5 rounded-md py-3 px-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-300" />
          <select
            className="w-full bg-richblack-700 text-richblack-5 rounded-md py-3 px-10 appearance-none focus:outline-none focus:ring-1 focus:ring-yellow-50"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-richblack-300 mb-4">
        Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
      </p>

      {/* Course cards */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-10 bg-richblack-800 rounded-lg border border-richblack-700 p-8">
          <p className="text-richblack-5 text-xl mb-2">No courses found</p>
          <p className="text-richblack-300 mb-4">Try adjusting your search or filter</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEnroll={handleEnroll}
              enrolling={enrolling === course._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course, onEnroll, enrolling }) {
  const isEnrolled = isEnrolledInCourse(course._id);
  
  return (
    <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 hover:border-yellow-50 hover:transform hover:scale-[1.01] transition-all duration-300 shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || `https://placehold.co/500x300/222/444?text=${encodeURIComponent(course.category.name)}`}
          alt={course.courseName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-yellow-50 text-richblack-900 text-xs font-semibold px-2 py-1 rounded-full">
          ★ {course.averageRating.toFixed(1)}
        </div>
        {isEnrolled && (
          <div className="absolute top-2 left-2 bg-caribbeangreen-200 text-richblack-900 text-xs font-semibold px-2 py-1 rounded-full">
            Enrolled
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-richblack-900 to-transparent h-16"></div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-richblack-5 font-semibold text-lg line-clamp-1 hover:text-yellow-50 transition-colors">
            {course.courseName}
          </h3>
          <p className="text-yellow-50 text-xs">{course.category.name}</p>
        </div>
        <p className="text-richblack-300 text-sm mb-3 line-clamp-2 h-10">
          {course.courseDescription}
        </p>

        <div className="flex items-center justify-between text-xs text-richblack-300 mb-3">
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-richblack-700 flex items-center justify-center text-richblack-100">
              {course.instructor.firstName.charAt(0)}
            </span>
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
          <span className="text-richblack-300">{course.ratingCount} reviews</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {course.tags && course.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-richblack-700 text-richblack-300 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-yellow-50 font-semibold text-lg">₹{course.price}</span>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/course-details/${course._id}`} 
            className="flex-1 text-center py-2 rounded-md font-semibold border border-yellow-50 text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900 transition-all"
          >
            Details
          </Link>
          {isEnrolled ? (
            <Link
              to="/dashboard/enrolled-courses"
              className="flex-1 text-center py-2 rounded-md font-semibold bg-caribbeangreen-200 text-richblack-900 hover:bg-caribbeangreen-100 transition-all"
            >
              Go to Course
            </Link>
          ) : (
            <button
              onClick={() => onEnroll(course._id)}
              disabled={enrolling}
              className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                enrolling
                  ? "bg-richblack-700 text-richblack-300"
                  : "bg-yellow-50 text-richblack-900 hover:bg-yellow-100"
              }`}
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="h-8 w-64 bg-richblack-700 rounded mb-6 animate-pulse"></div>
      <div className="h-4 w-96 bg-richblack-700 rounded mb-8 animate-pulse"></div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="h-12 w-full bg-richblack-700 rounded animate-pulse"></div>
        <div className="h-12 md:w-64 bg-richblack-700 rounded animate-pulse"></div>
      </div>

      <div className="h-4 w-40 bg-richblack-700 rounded mb-4 animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700"
          >
            <div className="h-40 w-full bg-richblack-700 animate-pulse"></div>
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <div className="h-6 w-3/4 bg-richblack-700 rounded animate-pulse"></div>
                <div className="h-6 w-10 bg-richblack-700 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-richblack-700 rounded mb-3 animate-pulse"></div>
              <div className="h-4 w-5/6 bg-richblack-700 rounded mb-4 animate-pulse"></div>

              <div className="flex justify-between mb-4">
                <div className="h-3 w-1/3 bg-richblack-700 rounded animate-pulse"></div>
                <div className="h-3 w-1/4 bg-richblack-700 rounded animate-pulse"></div>
              </div>

              <div className="flex justify-between mb-4">
                <div className="h-5 w-16 bg-richblack-700 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-richblack-700 rounded animate-pulse"></div>
              </div>

              <div className="h-10 w-full bg-richblack-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}