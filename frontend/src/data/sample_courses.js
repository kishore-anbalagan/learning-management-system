// Sample courses for catalog page
export const sampleCourses = [
  {
    _id: "course1",
    courseName: "JavaScript Fundamentals 2023",
    courseDescription: "Master the core concepts of JavaScript to build interactive websites",
    instructor: { firstName: "John", lastName: "Smith" },
    ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }],
    price: 4999,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amF2YXNjcmlwdHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    _id: "course2",
    courseName: "React.js - Complete Developer Guide",
    courseDescription: "Learn React.js from scratch and build modern web applications",
    instructor: { firstName: "Sarah", lastName: "Johnson" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    price: 5999,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVhY3R8ZW58MHx8MHx8fDA%3D"
  },
  {
    _id: "course3",
    courseName: "Python Programming Masterclass",
    courseDescription: "Become a Python expert with practical examples and projects",
    instructor: { firstName: "Michael", lastName: "Williams" },
    ratingAndReviews: [{ rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
    price: 4499,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHl0aG9ufGVufDB8fDB8fHww"
  },
  {
    _id: "course4",
    courseName: "Full Stack Web Development Bootcamp",
    courseDescription: "Learn front-end and back-end development with real-world projects",
    instructor: { firstName: "Jessica", lastName: "Brown" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
    price: 7999,
    thumbnail: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D"
  },
  {
    _id: "course5",
    courseName: "Machine Learning with Python",
    courseDescription: "Build intelligent systems using machine learning algorithms",
    instructor: { firstName: "David", lastName: "Clark" },
    ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }],
    price: 6499,
    thumbnail: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hY2hpbmUlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    _id: "course6",
    courseName: "AWS Cloud Practitioner Certification",
    courseDescription: "Prepare for the AWS Cloud Practitioner certification exam",
    instructor: { firstName: "Emily", lastName: "Wilson" },
    ratingAndReviews: [{ rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    price: 5499,
    thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXdzfGVufDB8fDB8fHww"
  },
  {
    _id: "course7",
    courseName: "Flutter & Dart Mobile App Development",
    courseDescription: "Create beautiful native mobile apps for Android and iOS",
    instructor: { firstName: "Raj", lastName: "Patel" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    price: 5999,
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fHww"
  },
  {
    _id: "course8",
    courseName: "UI/UX Design Fundamentals",
    courseDescription: "Learn to create beautiful and user-friendly interfaces",
    instructor: { firstName: "Amanda", lastName: "Lee" },
    ratingAndReviews: [{ rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
    price: 4999,
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dWklMjBkZXNpZ258ZW58MHx8MHx8fDA%3D"
  },
  {
    _id: "course9",
    courseName: "Cybersecurity Fundamentals",
    courseDescription: "Learn to protect systems and networks from cyber threats",
    instructor: { firstName: "Marcus", lastName: "Thompson" },
    ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }],
    price: 6999,
    thumbnail: "https://images.unsplash.com/photo-1614064642639-e398cf05badb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3liZXJzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    _id: "course10",
    courseName: "DevOps & CI/CD Pipeline",
    courseDescription: "Master continuous integration and deployment workflows",
    instructor: { firstName: "Thomas", lastName: "Chen" },
    ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }],
    price: 7499,
    thumbnail: "https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGV2b3BzfGVufDB8fDB8fHww"
  }
];