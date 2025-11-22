const axios = require('axios');

// Test the enrolled courses API
async function testEnrolledCoursesAPI() {
    try {
        // First, login to get token
        console.log('🔐 Logging in as kamal...');
        const loginResponse = await axios.post('http://localhost:4000/api/v1/auth/login', {
            email: 'kamal@gmail.com',
            password: '12345678',
            accountType: 'Student'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful, token received\n');
        
        // Now fetch enrolled courses
        console.log('📚 Fetching enrolled courses...');
        const coursesResponse = await axios.get('http://localhost:4000/api/v1/profile/getEnrolledCourses', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        console.log('✅ Enrolled courses API response:\n');
        console.log('Success:', coursesResponse.data.success);
        console.log('Number of courses:', coursesResponse.data.data.length);
        
        if (coursesResponse.data.data.length > 0) {
            console.log('\n📖 First course details:');
            const firstCourse = coursesResponse.data.data[0];
            console.log('  Name:', firstCourse.courseName);
            console.log('  Thumbnail:', firstCourse.thumbnail);
            console.log('  Category:', firstCourse.category);
            console.log('  Instructor:', firstCourse.instructor);
            console.log('  Progress:', firstCourse.progress + '%');
            console.log('  Total Lessons:', firstCourse.totalLessons);
            console.log('  Sections:', firstCourse.courseContent?.length || 0);
        }
        
        console.log('\n✅ API test completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testEnrolledCoursesAPI();
