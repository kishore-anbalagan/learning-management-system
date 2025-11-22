const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');
const Course = require('./models/course');
const Category = require('./models/category');

mongoose.connect('mongodb://localhost:27017/7')
  .then(async () => {
    console.log('✅ Database connected\n');
    
    // Get kamal's enrolled courses with populated data
    const user = await User.findOne({ email: 'kamal@gmail.com' })
      .populate({
        path: 'courses',
        populate: [
          { path: 'instructor', select: 'firstName lastName' },
          { path: 'category', select: 'name' }
        ]
      });
    
    if (!user) {
      console.log('❌ User kamal@gmail.com not found');
      process.exit(1);
    }
    
    console.log(`📚 Kamal has ${user.courses.length} enrolled courses:\n`);
    
    user.courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.courseName}`);
      console.log(`   Thumbnail: ${course.thumbnail ? '✅ ' + course.thumbnail.substring(0, 50) + '...' : '❌ MISSING'}`);
      console.log(`   Category: ${course.category?.name || '❌ MISSING'}`);
      console.log(`   Instructor: ${course.instructor ? `✅ ${course.instructor.firstName} ${course.instructor.lastName}` : '❌ MISSING'}`);
      console.log('');
    });
    
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
