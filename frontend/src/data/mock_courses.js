// Mock data for trending courses
export const topEnrollmentCourses = [
  {
    _id: "trending1",
    courseName: "Complete JavaScript Masterclass 2023",
    courseDescription: "Learn JavaScript from scratch to advanced concepts with real-world projects.",
    instructor: { firstName: "David", lastName: "Johnson" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    price: 4999,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amF2YXNjcmlwdHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    _id: "trending2",
    courseName: "React.js & Redux - The Complete Guide",
    courseDescription: "Master React, Redux, and modern frontend development with hands-on projects.",
    instructor: { firstName: "Sarah", lastName: "Chen" },
    ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }],
    price: 6499,
    thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVhY3R8ZW58MHx8MHx8fDA%3D"
  },
  {
    _id: "trending3",
    courseName: "The Complete Python Pro Bootcamp",
    courseDescription: "From beginner to professional Python developer with 100+ coding exercises and projects.",
    instructor: { firstName: "Michael", lastName: "Taylor" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
    price: 5999,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHl0aG9ufGVufDB8fDB8fHww"
  },
  {
    _id: "trending4",
    courseName: "Full Stack Web Development Bootcamp",
    courseDescription: "Become a full-stack web developer with this comprehensive course covering front-end and back-end technologies.",
    instructor: { firstName: "Jessica", lastName: "Miller" },
    ratingAndReviews: [{ rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 5 }],
    price: 7999,
    thumbnail: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D"
  },
  {
    _id: "trending5",
    courseName: "Data Science with Python: Machine Learning",
    courseDescription: "Master data science and machine learning using Python, pandas, scikit-learn, and TensorFlow.",
    instructor: { firstName: "Robert", lastName: "Zhang" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    price: 8499,
    thumbnail: "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hY2hpbmUlMjBsZWFybmluZ3xlbnwwfHwwfHx8MA%3D%3D"
  }
];

// Mock data for popular courses
export const popularPicksCourses = [
  {
    _id: "popular1",
    courseName: "Blockchain Development with Solidity",
    courseDescription: "Learn to build decentralized applications on Ethereum with Solidity and Web3.js.",
    instructor: { firstName: "Kevin", lastName: "O'Leary" },
    ratingAndReviews: [{ rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
    price: 7499,
    thumbnail: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmxvY2tjaGFpbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    _id: "popular2",
    courseName: "AWS Certified Solutions Architect",
    courseDescription: "Prepare for the AWS Solutions Architect certification with hands-on labs and detailed explanations.",
    instructor: { firstName: "Amanda", lastName: "Brown" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
    price: 8999,
    thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXdzfGVufDB8fDB8fHww"
  },
  {
    _id: "popular3",
    courseName: "Flutter & Dart: Mobile App Development",
    courseDescription: "Build beautiful native apps for iOS and Android from a single codebase with Flutter.",
    instructor: { firstName: "Raj", lastName: "Patel" },
    ratingAndReviews: [{ rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 5 }],
    price: 6499,
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fHww"
  },
  {
    _id: "popular4",
    courseName: "Digital Marketing Masterclass",
    courseDescription: "Comprehensive guide to digital marketing including SEO, social media, email marketing, and PPC.",
    instructor: { firstName: "Lauren", lastName: "Adams" },
    ratingAndReviews: [{ rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }],
    price: 5999,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGlnaXRhbCUyMG1hcmtldGluZ3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    _id: "popular5",
    courseName: "Cybersecurity Fundamentals",
    courseDescription: "Learn essential cybersecurity concepts, tools, and techniques to protect systems and networks.",
    instructor: { firstName: "Marcus", lastName: "Thompson" },
    ratingAndReviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
    price: 7299,
    thumbnail: "https://images.unsplash.com/photo-1614064642639-e398cf05badb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3liZXJzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D"
  }
];