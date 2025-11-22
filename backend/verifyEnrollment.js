const mongoose = require('mongoose');
const User = require('./models/user');
const Course = require('./models/course');
const Category = require('./models/category');
const Section = require('./models/section');
const SubSection = require('./models/subSection');

mongoose.connect('mongodb://localhost:27017/7')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Find kamal user
        const user = await User.findOne({ email: 'kamal@gmail.com' });
        console.log('\n📧 User:', user.email);
        console.log('👤 Account Type:', user.accountType);
        console.log('📚 Enrolled Courses Count:', user.courses?.length || 0);

        if (user.courses && user.courses.length > 0) {
            console.log('\n✅ Already enrolled in courses:');
            const courses = await Course.find({ _id: { $in: user.courses } })
                .populate('category', 'name')
                .populate('instructor', 'firstName lastName');
            
            courses.forEach((course, index) => {
                console.log(`\n${index + 1}. ${course.courseName}`);
                console.log(`   Category: ${course.category?.name || 'N/A'}`);
                console.log(`   Instructor: ${course.instructor?.firstName} ${course.instructor?.lastName}`);
                console.log(`   Thumbnail: ${course.thumbnail ? '✓' : '✗'}`);
                console.log(`   Sections: ${course.courseContent?.length || 0}`);
            });
        } else {
            console.log('\n⚠️ User not enrolled in any courses!');
            console.log('Let me enroll you in all available courses...\n');

            // Get all published courses
            const allCourses = await Course.find({ status: 'Published' });
            console.log(`Found ${allCourses.length} published courses`);

            // Enroll in all courses
            const courseIds = allCourses.map(c => c._id);
            user.courses = courseIds;
            await user.save();

            // Add user to studentsEnrolled in each course
            for (const course of allCourses) {
                if (!course.studentsEnrolled.includes(user._id)) {
                    course.studentsEnrolled.push(user._id);
                    await course.save();
                }
                console.log(`✅ Enrolled in: ${course.courseName}`);
            }

            console.log(`\n🎉 Successfully enrolled in ${allCourses.length} courses!`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
