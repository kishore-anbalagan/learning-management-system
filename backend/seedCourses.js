const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/course');
const Category = require('./models/category');
const User = require('./models/user');
const Section = require('./models/section');
const SubSection = require('./models/subSection');

// Connect to database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Database connected successfully'))
.catch(error => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
});

// Sample YouTube video links for programming courses
const sampleCourses = [
    {
        courseName: "JavaScript Mastery - Complete Guide",
        courseDescription: "Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks",
        category: "Programming",
        price: 2999,
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500",
        sections: [
            {
                sectionName: "JavaScript Fundamentals",
                subSections: [
                    { title: "Introduction to JavaScript", youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk", timeDuration: "1200", description: "Learn the basics of JavaScript" },
                    { title: "Variables and Data Types", youtubeUrl: "https://www.youtube.com/watch?v=9emXNzqCKyg", timeDuration: "900", description: "Understanding variables and data types" },
                    { title: "Functions and Scope", youtubeUrl: "https://www.youtube.com/watch?v=gigtS_5KOqo", timeDuration: "1500", description: "Deep dive into functions" }
                ]
            },
            {
                sectionName: "Advanced JavaScript",
                subSections: [
                    { title: "Promises and Async/Await", youtubeUrl: "https://www.youtube.com/watch?v=vn3tm0quoqE", timeDuration: "1800", description: "Asynchronous JavaScript" },
                    { title: "ES6+ Features", youtubeUrl: "https://www.youtube.com/watch?v=WZQc7RUAg18", timeDuration: "2100", description: "Modern JavaScript features" }
                ]
            }
        ]
    },
    {
        courseName: "React JS - Build Modern Web Apps",
        courseDescription: "Learn React from scratch and build professional web applications with hooks, context, and Redux",
        category: "Web Development",
        price: 3499,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
        sections: [
            {
                sectionName: "React Basics",
                subSections: [
                    { title: "React Introduction", youtubeUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk", timeDuration: "1500", description: "Getting started with React" },
                    { title: "Components and Props", youtubeUrl: "https://www.youtube.com/watch?v=jLS0TkAHvRg", timeDuration: "1200", description: "Understanding React components" },
                    { title: "State and Lifecycle", youtubeUrl: "https://www.youtube.com/watch?v=35lXWvCuM8o", timeDuration: "1800", description: "Managing state in React" }
                ]
            },
            {
                sectionName: "Advanced React",
                subSections: [
                    { title: "React Hooks", youtubeUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q", timeDuration: "2400", description: "Master React Hooks" },
                    { title: "Context API", youtubeUrl: "https://www.youtube.com/watch?v=HYKDUF8X3qI", timeDuration: "1500", description: "State management with Context" }
                ]
            }
        ]
    },
    {
        courseName: "Python Programming - Zero to Hero",
        courseDescription: "Complete Python course covering basics, OOP, data structures, and real-world projects",
        category: "Programming",
        price: 2499,
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
        sections: [
            {
                sectionName: "Python Basics",
                subSections: [
                    { title: "Python Introduction", youtubeUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", timeDuration: "2700", description: "Python fundamentals" },
                    { title: "Data Structures", youtubeUrl: "https://www.youtube.com/watch?v=R-HLU9Fl5ug", timeDuration: "3600", description: "Lists, tuples, and dictionaries" },
                    { title: "Functions and Modules", youtubeUrl: "https://www.youtube.com/watch?v=NSbOtYzIQI0", timeDuration: "1800", description: "Creating reusable code" }
                ]
            },
            {
                sectionName: "Object-Oriented Python",
                subSections: [
                    { title: "Classes and Objects", youtubeUrl: "https://www.youtube.com/watch?v=Ej_02ICOIgs", timeDuration: "2100", description: "OOP in Python" },
                    { title: "Inheritance and Polymorphism", youtubeUrl: "https://www.youtube.com/watch?v=RSl87lqOXDE", timeDuration: "1500", description: "Advanced OOP concepts" }
                ]
            }
        ]
    },
    {
        courseName: "Node.js & Express - Backend Development",
        courseDescription: "Build scalable backend applications with Node.js, Express, MongoDB, and REST APIs",
        category: "Backend Development",
        price: 3299,
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500",
        sections: [
            {
                sectionName: "Node.js Fundamentals",
                subSections: [
                    { title: "Node.js Introduction", youtubeUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4", timeDuration: "1800", description: "Getting started with Node.js" },
                    { title: "NPM and Modules", youtubeUrl: "https://www.youtube.com/watch?v=jHDhaSSKmB0", timeDuration: "1200", description: "Package management" },
                    { title: "File System and Streams", youtubeUrl: "https://www.youtube.com/watch?v=_1xa8Bsho6A", timeDuration: "1500", description: "Working with files" }
                ]
            },
            {
                sectionName: "Express and APIs",
                subSections: [
                    { title: "Express.js Basics", youtubeUrl: "https://www.youtube.com/watch?v=L72fhGm1tfE", timeDuration: "2400", description: "Building web servers" },
                    { title: "REST API Development", youtubeUrl: "https://www.youtube.com/watch?v=-MTSQjw5DrM", timeDuration: "3000", description: "Creating RESTful APIs" }
                ]
            }
        ]
    },
    {
        courseName: "MongoDB - Database Mastery",
        courseDescription: "Learn MongoDB from basics to advanced aggregation pipelines and performance optimization",
        category: "Database",
        price: 2799,
        thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500",
        sections: [
            {
                sectionName: "MongoDB Basics",
                subSections: [
                    { title: "MongoDB Introduction", youtubeUrl: "https://www.youtube.com/watch?v=c2M-rlkkT5o", timeDuration: "2400", description: "NoSQL database fundamentals" },
                    { title: "CRUD Operations", youtubeUrl: "https://www.youtube.com/watch?v=ExcRbA7fy_A", timeDuration: "1800", description: "Create, Read, Update, Delete" },
                    { title: "Data Modeling", youtubeUrl: "https://www.youtube.com/watch?v=3GHZd0zv170", timeDuration: "2100", description: "Designing schemas" }
                ]
            },
            {
                sectionName: "Advanced MongoDB",
                subSections: [
                    { title: "Aggregation Framework", youtubeUrl: "https://www.youtube.com/watch?v=A3jvoE0jGdE", timeDuration: "2700", description: "Complex queries" },
                    { title: "Indexing and Performance", youtubeUrl: "https://www.youtube.com/watch?v=1eVqm4Uf7XY", timeDuration: "1500", description: "Optimization techniques" }
                ]
            }
        ]
    },
    {
        courseName: "Full Stack Web Development Bootcamp",
        courseDescription: "Complete MERN stack course - MongoDB, Express, React, Node.js with real projects",
        category: "Web Development",
        price: 4999,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
        sections: [
            {
                sectionName: "Frontend Development",
                subSections: [
                    { title: "HTML & CSS Essentials", youtubeUrl: "https://www.youtube.com/watch?v=G3e-cpL7ofc", timeDuration: "3600", description: "Web fundamentals" },
                    { title: "React Development", youtubeUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", timeDuration: "4200", description: "Building UIs with React" },
                    { title: "State Management", youtubeUrl: "https://www.youtube.com/watch?v=poQXNp9ItL4", timeDuration: "2400", description: "Redux and Context API" }
                ]
            },
            {
                sectionName: "Backend and Deployment",
                subSections: [
                    { title: "Node.js Backend", youtubeUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE", timeDuration: "3600", description: "Server-side development" },
                    { title: "Database Integration", youtubeUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4", timeDuration: "2700", description: "Connecting to MongoDB" },
                    { title: "Deployment and Hosting", youtubeUrl: "https://www.youtube.com/watch?v=l134cBAJCuc", timeDuration: "1800", description: "Deploy to production" }
                ]
            }
        ]
    }
];

async function seedCourses() {
    try {
        console.log('\n🌱 Starting to seed courses...\n');
        
        // Get an instructor user
        const instructor = await User.findOne({ accountType: 'Instructor' });
        
        if (!instructor) {
            console.log('❌ No instructor found. Please create an instructor account first.');
            process.exit(1);
        }
        
        console.log(`✅ Found instructor: ${instructor.firstName} ${instructor.lastName}`);
        
        let coursesCreated = 0;
        
        for (const courseData of sampleCourses) {
            // Find or create category
            let category = await Category.findOne({ name: courseData.category });
            if (!category) {
                category = await Category.create({
                    name: courseData.category,
                    description: `Courses related to ${courseData.category}`
                });
                console.log(`📁 Created category: ${category.name}`);
            }
            
            // Check if course already exists
            const existingCourse = await Course.findOne({ 
                courseName: courseData.courseName 
            });
            
            if (existingCourse) {
                console.log(`⏭️  Skipping "${courseData.courseName}" - already exists`);
                continue;
            }
            
            // Create sections and subsections
            const sectionIds = [];
            
            for (const sectionData of courseData.sections) {
                const subSectionIds = [];
                
                for (const subSectionData of sectionData.subSections) {
                    const subSection = await SubSection.create({
                        title: subSectionData.title,
                        timeDuration: subSectionData.timeDuration,
                        description: subSectionData.description,
                        videoUrl: subSectionData.youtubeUrl,
                        youtubeUrl: subSectionData.youtubeUrl
                    });
                    subSectionIds.push(subSection._id);
                }
                
                const section = await Section.create({
                    sectionName: sectionData.sectionName,
                    subSection: subSectionIds
                });
                sectionIds.push(section._id);
            }
            
            // Create course
            const course = await Course.create({
                courseName: courseData.courseName,
                courseDescription: courseData.courseDescription,
                instructor: instructor._id,
                whatYouWillLearn: `Master ${courseData.courseName} with hands-on projects and real-world examples`,
                courseContent: sectionIds,
                price: courseData.price,
                thumbnail: courseData.thumbnail,
                category: category._id,
                tags: [courseData.category, 'Programming', 'Development'],
                instructions: ['Have a computer with internet', 'Willingness to learn', 'Basic computer skills'],
                status: 'Published',
                studentsEnrolled: []
            });
            
            // Add course to instructor's courses
            await User.findByIdAndUpdate(
                instructor._id,
                { $push: { courses: course._id } }
            );
            
            coursesCreated++;
            console.log(`✅ Created course: ${course.courseName}`);
        }
        
        console.log(`\n🎉 Successfully created ${coursesCreated} courses!`);
        console.log('\n📊 Summary:');
        
        const totalCourses = await Course.countDocuments();
        const totalCategories = await Category.countDocuments();
        
        console.log(`   Total courses in database: ${totalCourses}`);
        console.log(`   Total categories: ${totalCategories}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding courses:', error);
        process.exit(1);
    }
}

// Run the seeder
seedCourses();
