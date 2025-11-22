const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');
const Course = require('./models/course');
const Category = require('./models/category');

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/7')
    .then(async () => {
        console.log('✅ Database connected\n');
        
        // Find kamal
        const kamal = await User.findOne({ email: 'kamal@gmail.com' }).populate({
            path: 'courses',
            populate: [
                { path: 'instructor', select: 'firstName lastName' },
                { path: 'category', select: 'name' }
            ]
        });
        
        console.log('👤 Student:', kamal.firstName, kamal.email);
        console.log('📚 Enrolled courses:', kamal.courses.length);
        
        if (kamal.courses.length > 0) {
            console.log('\nEnrolled in:');
            kamal.courses.forEach(course => {
                console.log(`  - ${course.courseName}`);
                console.log(`    Category: ${course.category?.name || 'N/A'}`);
                console.log(`    Instructor: ${course.instructor?.firstName || 'N/A'} ${course.instructor?.lastName || ''}`);
            });
        } else {
            console.log('⚠️ No courses enrolled yet!\n');
            
            // Get all available courses
            const allCourses = await Course.find({}).populate('instructor category');
            console.log('Available courses in database:', allCourses.length);
            
            if (allCourses.length > 0) {
                console.log('\nDo you want to enroll kamal in all courses? (Y/N)');
                console.log('Courses:');
                allCourses.forEach(course => {
                    console.log(`  - ${course.courseName} (${course.category?.name || 'General'})`);
                });
                
                // Auto-enroll for now
                console.log('\n🔄 Auto-enrolling student in all courses...');
                
                for (const course of allCourses) {
                    // Add course to user's courses
                    if (!kamal.courses.includes(course._id)) {
                        kamal.courses.push(course._id);
                    }
                    
                    // Add user to course's studentsEnrolled
                    if (!course.studentsEnrolled.includes(kamal._id)) {
                        course.studentsEnrolled.push(kamal._id);
                        await course.save();
                    }
                }
                
                await kamal.save();
                console.log(`✅ Successfully enrolled in ${allCourses.length} courses!`);
                
                // Verify enrollment
                const updatedKamal = await User.findOne({ email: 'kamal@gmail.com' }).populate({
                    path: 'courses',
                    populate: [
                        { path: 'instructor', select: 'firstName lastName' },
                        { path: 'category', select: 'name' }
                    ]
                });
                
                console.log('\n✅ Verification - Now enrolled in:');
                updatedKamal.courses.forEach(course => {
                    console.log(`  - ${course.courseName} (${course.category?.name || 'General'})`);
                });
            } else {
                console.log('⚠️ No courses found in database. Please run seedCourses.js first.');
            }
        }
        
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
