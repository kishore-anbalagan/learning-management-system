const Category = require('../models/category');
const Course = require('../models/course');
const User = require('../models/user');
const { uploadImageToCloudinary } = require('../utils/imageUploader');

// Helper function to add demo categories and courses
exports.addDemoContent = async (req, res) => {
    try {
        // First, check if we already have categories
        const existingCategories = await Category.find({});
        if (existingCategories.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Demo content already exists',
                data: {
                    categories: existingCategories
                }
            });
        }

        // Get an instructor user
        const instructor = await User.findOne({ accountType: 'Instructor' });
        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: 'No instructor found. Please create an instructor account first.'
            });
        }

        // Create demo categories
        const categories = [
            {
                name: 'Web Development',
                description: 'Learn to build modern web applications with the latest technologies'
            },
            {
                name: 'Data Science',
                description: 'Master data analysis, machine learning, and statistics'
            },
            {
                name: 'Mobile Development',
                description: 'Create apps for iOS and Android platforms'
            },
            {
                name: 'Game Development',
                description: 'Design and develop engaging games for various platforms'
            },
            {
                name: 'Cloud Computing',
                description: 'Learn to build and deploy applications on cloud platforms'
            }
        ];

        const createdCategories = [];
        for (const category of categories) {
            const newCategory = await Category.create(category);
            createdCategories.push(newCategory);
        }

        // Create demo courses for each category
        const courses = [
            // Web Development courses
            {
                courseName: 'JavaScript Fundamentals',
                courseDescription: 'Master the basics of JavaScript programming language',
                whatYouWillLearn: 'Variables, Data Types, Functions, Objects, Arrays, DOM Manipulation',
                price: 49.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[0]._id,
                instructor: instructor._id,
                tag: ['Beginner', 'Programming', 'Web'],
                status: 'Published',
                instructions: 'Start with the basics and progress through the modules'
            },
            {
                courseName: 'React.js for Beginners',
                courseDescription: 'Learn the most popular frontend framework',
                whatYouWillLearn: 'Components, State, Props, Hooks, Context API, Redux',
                price: 59.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[0]._id,
                instructor: instructor._id,
                tag: ['Intermediate', 'React', 'Web'],
                status: 'Published',
                instructions: 'Basic JavaScript knowledge required'
            },
            
            // Data Science courses
            {
                courseName: 'Python for Data Analysis',
                courseDescription: 'Learn how to analyze data using Python',
                whatYouWillLearn: 'Pandas, NumPy, Matplotlib, Data Cleaning, Visualization',
                price: 69.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[1]._id,
                instructor: instructor._id,
                tag: ['Beginner', 'Python', 'Data'],
                status: 'Published',
                instructions: 'No prior experience needed'
            },
            {
                courseName: 'Machine Learning Fundamentals',
                courseDescription: 'Introduction to machine learning algorithms and techniques',
                whatYouWillLearn: 'Supervised Learning, Unsupervised Learning, Model Evaluation',
                price: 79.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[1]._id,
                instructor: instructor._id,
                tag: ['Intermediate', 'ML', 'Python'],
                status: 'Published',
                instructions: 'Basic Python knowledge required'
            },
            
            // Mobile Development courses
            {
                courseName: 'Flutter App Development',
                courseDescription: 'Build cross-platform mobile apps with Flutter',
                whatYouWillLearn: 'Dart, Widgets, State Management, APIs, Firebase',
                price: 59.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[2]._id,
                instructor: instructor._id,
                tag: ['Intermediate', 'Mobile', 'Flutter'],
                status: 'Published',
                instructions: 'Some programming experience recommended'
            },
            {
                courseName: 'iOS Development with Swift',
                courseDescription: 'Learn to build native iOS applications',
                whatYouWillLearn: 'Swift, UIKit, SwiftUI, Core Data, APIs',
                price: 69.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[2]._id,
                instructor: instructor._id,
                tag: ['Advanced', 'iOS', 'Swift'],
                status: 'Published',
                instructions: 'Mac computer required'
            },
            
            // Game Development courses
            {
                courseName: 'Unity Game Development',
                courseDescription: 'Create 2D and 3D games with Unity',
                whatYouWillLearn: 'C#, Unity Engine, Game Physics, Animation, UI Design',
                price: 69.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[3]._id,
                instructor: instructor._id,
                tag: ['Beginner', 'Game', 'Unity'],
                status: 'Published',
                instructions: 'No prior experience needed'
            },
            
            // Cloud Computing courses
            {
                courseName: 'AWS Certified Solutions Architect',
                courseDescription: 'Prepare for the AWS certification exam',
                whatYouWillLearn: 'EC2, S3, RDS, Lambda, VPC, CloudFormation',
                price: 89.99,
                thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
                category: createdCategories[4]._id,
                instructor: instructor._id,
                tag: ['Advanced', 'AWS', 'Cloud'],
                status: 'Published',
                instructions: 'Basic IT knowledge required'
            }
        ];

        const createdCourses = [];
        for (const course of courses) {
            const newCourse = await Course.create(course);
            
            // Add course to category
            await Category.findByIdAndUpdate(
                course.category,
                { $push: { courses: newCourse._id } },
                { new: true }
            );
            
            // Add course to instructor
            await User.findByIdAndUpdate(
                instructor._id,
                { $push: { courses: newCourse._id } },
                { new: true }
            );
            
            createdCourses.push(newCourse);
        }

        return res.status(200).json({
            success: true,
            message: 'Demo content added successfully',
            data: {
                categories: createdCategories,
                courses: createdCourses
            }
        });
    } catch (error) {
        console.error('Error adding demo content:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add demo content',
            error: error.message
        });
    }
};