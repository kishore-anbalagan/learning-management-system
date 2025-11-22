const axios = require('axios');

// Test the getEnrolledCourses API endpoint
async function testAPI() {
  try {
    // First, login to get a token
    console.log('1. Logging in as kamal@gmail.com...');
    const loginResponse = await axios.post('http://localhost:4001/api/v1/auth/login', {
      email: 'kamal@gmail.com',
      password: 'password123',
      accountType: 'Student'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful! Token received.\n');
    
    // Now test the getEnrolledCourses endpoint
    console.log('2. Fetching enrolled courses...');
    const coursesResponse = await axios.get('http://localhost:4001/api/v1/profile/getEnrolledCourses', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (coursesResponse.data.success) {
      console.log('✅ API Response successful!');
      console.log(`\n📚 Number of courses: ${coursesResponse.data.data.length}`);
      
      console.log('\nCourse Details:');
      coursesResponse.data.data.forEach((course, index) => {
        console.log(`\n${index + 1}. ${course.courseName}`);
        console.log(`   Thumbnail: ${course.thumbnail ? '✅' : '❌'}`);
        console.log(`   Category: ${course.category?.name || '❌ Missing'}`);
        console.log(`   Instructor: ${course.instructor ? course.instructor.firstName + ' ' + course.instructor.lastName : '❌ Missing'}`);
        console.log(`   Progress: ${course.progress || course.progressPercentage || 0}%`);
      });
    } else {
      console.log('❌ API returned success: false');
      console.log(coursesResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
