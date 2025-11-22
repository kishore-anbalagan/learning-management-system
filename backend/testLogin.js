const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api/v1/auth';

// Test cases
const tests = [
    {
        name: 'Student trying to login as Student (Should PASS)',
        data: {
            email: 'kamal@gmail.com',
            password: 'kamal123',
            accountType: 'Student'
        }
    },
    {
        name: 'Student trying to login as Instructor (Should FAIL)',
        data: {
            email: 'kamal@gmail.com',
            password: 'kamal123',
            accountType: 'Instructor'
        }
    },
    {
        name: 'Instructor trying to login as Instructor (Should PASS)',
        data: {
            email: 'kis@gmail.com',
            password: 'kishore123',
            accountType: 'Instructor'
        }
    },
    {
        name: 'Instructor trying to login as Student (Should FAIL)',
        data: {
            email: 'kis@gmail.com',
            password: 'kishore123',
            accountType: 'Student'
        }
    }
];

async function runTests() {
    console.log('🧪 Testing Account Type Validation\n');
    console.log('='.repeat(60));

    for (const test of tests) {
        console.log(`\n📝 Test: ${test.name}`);
        console.log(`   Email: ${test.data.email}`);
        console.log(`   Account Type: ${test.data.accountType}`);
        
        try {
            const response = await axios.post(`${BASE_URL}/login`, test.data);
            
            if (response.data.success) {
                console.log(`   ✅ Result: SUCCESS`);
                console.log(`   Message: ${response.data.message}`);
                console.log(`   User Account Type: ${response.data.user.accountType}`);
            }
        } catch (error) {
            if (error.response) {
                console.log(`   ❌ Result: FAILED (as expected)`);
                console.log(`   Status: ${error.response.status}`);
                console.log(`   Message: ${error.response.data.message}`);
            } else {
                console.log(`   ⚠️  Error: ${error.message}`);
            }
        }
        
        console.log('-'.repeat(60));
    }
    
    console.log('\n✨ Testing completed!\n');
}

runTests();
