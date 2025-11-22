const mongoose = require('mongoose');
const User = require('./models/user');
const Category = require('./models/category');
const Course = require('./models/course');
const Section = require('./models/section');
const SubSection = require('./models/subSection');
const RatingAndReview = require('./models/ratingAndReview');

mongoose.connect('mongodb://localhost:27017/7')
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Get a sample course ID
    const course = await Course.findOne({ courseName: /JavaScript/ });
    
    if (!course) {
      console.log('❌ No JavaScript course found');
      process.exit(1);
    }
    
    console.log('Testing getCourseDetails for course:', course.courseName);
    console.log('Course ID:', course._id);
    
    // Now try to populate like the API does
    try {
      const populatedCourse = await Course.findById(course._id)
        .populate('instructor', 'firstName lastName email image')
        .populate('category', 'name description')
        .populate({
          path: 'courseContent',
          populate: {
            path: 'subSection',
            select: 'title description videoUrl youtubeUrl timeDuration'
          }
        })
        .populate('ratingAndReviews');
      
      console.log('\n✅ Successfully populated course');
      console.log('Instructor:', populatedCourse.instructor?.firstName, populatedCourse.instructor?.lastName);
      console.log('Category:', populatedCourse.category?.name);
      console.log('Sections:', populatedCourse.courseContent?.length);
      
      if (populatedCourse.courseContent && populatedCourse.courseContent.length > 0) {
        console.log('\nFirst section:', populatedCourse.courseContent[0].sectionName);
        console.log('SubSections in first section:', populatedCourse.courseContent[0].subSection?.length);
        
        if (populatedCourse.courseContent[0].subSection && populatedCourse.courseContent[0].subSection.length > 0) {
          const firstVideo = populatedCourse.courseContent[0].subSection[0];
          console.log('\nFirst video:');
          console.log('  Title:', firstVideo.title);
          console.log('  YouTube URL:', firstVideo.youtubeUrl);
          console.log('  Duration:', firstVideo.timeDuration);
        }
      }
      
    } catch (error) {
      console.error('\n❌ Error during populate:', error.message);
      console.error('Stack:', error.stack);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
