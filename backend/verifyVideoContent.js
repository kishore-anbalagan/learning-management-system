const mongoose = require('mongoose');
const User = require('./models/user');
const Category = require('./models/category');
const Course = require('./models/course');
const Section = require('./models/section');
const SubSection = require('./models/subSection');

mongoose.connect('mongodb://localhost:27017/7')
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Get one course with full populate
    const course = await Course.findOne({ courseName: /JavaScript/ })
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSection',
          select: 'title videoUrl youtubeUrl timeDuration'
        }
      })
      .populate('instructor', 'firstName lastName')
      .populate('category', 'name');
    
    if (!course) {
      console.log('❌ No JavaScript course found');
      process.exit(1);
    }
    
    console.log('📚 Course:', course.courseName);
    console.log('👤 Instructor:', course.instructor.firstName, course.instructor.lastName);
    console.log('📂 Category:', course.category.name);
    console.log('📸 Thumbnail:', course.thumbnail ? '✓' : '✗');
    console.log('📁 Sections:', course.courseContent?.length || 0);
    console.log('');
    
    if (course.courseContent && course.courseContent.length > 0) {
      course.courseContent.forEach((section, idx) => {
        console.log(`\n📖 Section ${idx + 1}: ${section.sectionName}`);
        console.log(`   SubSections: ${section.subSection?.length || 0}`);
        
        if (section.subSection && section.subSection.length > 0) {
          section.subSection.forEach((sub, subIdx) => {
            console.log(`\n   🎥 Video ${subIdx + 1}: ${sub.title}`);
            console.log(`      YouTube URL: ${sub.youtubeUrl || sub.videoUrl || 'MISSING!'}`);
            console.log(`      Duration: ${sub.timeDuration || 0} seconds`);
          });
        } else {
          console.log('   ⚠️  NO VIDEOS IN THIS SECTION!');
        }
      });
    } else {
      console.log('⚠️ NO SECTIONS FOUND IN THIS COURSE!');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
