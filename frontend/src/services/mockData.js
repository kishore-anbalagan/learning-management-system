// Mock catalog data for development
export const mockCatalogData = {
  "Web Development": {
    selectedCategory: {
      _id: "web-dev",
      name: "Web Development",
      description: "Learn to build modern web applications with the latest technologies",
      courses: [
        {
          _id: "course1",
          courseName: "JavaScript Fundamentals",
          courseDescription: "Master the basics of JavaScript programming language",
          instructor: {
            firstName: "John",
            lastName: "Doe"
          },
          ratingAndReviews: [
            { rating: 4 },
            { rating: 5 },
            { rating: 4 }
          ],
          price: 49.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Beginner", "Programming", "Web"]
        },
        {
          _id: "course2",
          courseName: "React.js for Beginners",
          courseDescription: "Learn the most popular frontend framework",
          instructor: {
            firstName: "Jane",
            lastName: "Smith"
          },
          ratingAndReviews: [
            { rating: 5 },
            { rating: 5 },
            { rating: 4 }
          ],
          price: 59.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Intermediate", "React", "Web"]
        },
        {
          _id: "course3",
          courseName: "Node.js and Express",
          courseDescription: "Build backend applications with Node.js and Express",
          instructor: {
            firstName: "Alex",
            lastName: "Johnson"
          },
          ratingAndReviews: [
            { rating: 4 },
            { rating: 4 },
            { rating: 5 }
          ],
          price: 69.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Intermediate", "Backend", "Node"]
        }
      ]
    },
    topSellingCourses: [
      {
        _id: "course4",
        courseName: "Full Stack Web Development",
        courseDescription: "Become a full stack developer with MERN stack",
        instructor: {
          firstName: "Michael",
          lastName: "Brown"
        },
        ratingAndReviews: [
          { rating: 5 },
          { rating: 5 },
          { rating: 5 }
        ],
        price: 89.99,
        thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
        tag: ["Advanced", "Full Stack", "MERN"]
      }
    ]
  },
  "Data Science": {
    selectedCategory: {
      _id: "data-science",
      name: "Data Science",
      description: "Master data analysis, machine learning, and statistics",
      courses: [
        {
          _id: "course5",
          courseName: "Python for Data Analysis",
          courseDescription: "Learn how to analyze data using Python",
          instructor: {
            firstName: "Sarah",
            lastName: "Wilson"
          },
          ratingAndReviews: [
            { rating: 4 },
            { rating: 5 },
            { rating: 4 }
          ],
          price: 69.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Beginner", "Python", "Data"]
        },
        {
          _id: "course6",
          courseName: "Machine Learning Fundamentals",
          courseDescription: "Introduction to machine learning algorithms and techniques",
          instructor: {
            firstName: "Robert",
            lastName: "Clark"
          },
          ratingAndReviews: [
            { rating: 5 },
            { rating: 4 },
            { rating: 5 }
          ],
          price: 79.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Intermediate", "ML", "Python"]
        }
      ]
    }
  },
  "Mobile Development": {
    selectedCategory: {
      _id: "mobile-dev",
      name: "Mobile Development",
      description: "Create apps for iOS and Android platforms",
      courses: [
        {
          _id: "course7",
          courseName: "Flutter App Development",
          courseDescription: "Build cross-platform mobile apps with Flutter",
          instructor: {
            firstName: "Lisa",
            lastName: "Garcia"
          },
          ratingAndReviews: [
            { rating: 5 },
            { rating: 4 },
            { rating: 4 }
          ],
          price: 59.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Intermediate", "Mobile", "Flutter"]
        },
        {
          _id: "course8",
          courseName: "iOS Development with Swift",
          courseDescription: "Learn to build native iOS applications",
          instructor: {
            firstName: "James",
            lastName: "Taylor"
          },
          ratingAndReviews: [
            { rating: 4 },
            { rating: 5 },
            { rating: 5 }
          ],
          price: 69.99,
          thumbnail: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
          tag: ["Advanced", "iOS", "Swift"]
        }
      ]
    }
  }
};

import { sampleCourses } from '../data/sample_courses';

// Helper function to get catalog data
export const getMockCatalogData = (categoryId) => {
  // Format category name for display (convert from kebab-case)
  const formattedCategoryName = categoryId
    ? categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "Course Catalog";

  // Always return our sample courses to ensure we show 10 courses
  return {
    selectedCategory: {
      _id: categoryId || "sample-category",
      name: formattedCategoryName,
      description: `Browse our selection of top-rated ${formattedCategoryName} courses`,
      courses: sampleCourses
    },
    differentCategory: {
      _id: "recommended",
      name: "Recommended Courses",
      courses: sampleCourses.slice(5, 10)
    },
    mostSellingCourses: sampleCourses
  };
};