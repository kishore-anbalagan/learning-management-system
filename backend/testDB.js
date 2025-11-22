const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ Database connected successfully');
    console.log('📊 Database Name:', mongoose.connection.name);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    collections.forEach(col => {
        console.log(`   - ${col.name}`);
    });
    
    // Count users
    const User = require('./models/user');
    const userCount = await User.countDocuments();
    console.log(`\n👤 Total users in database: ${userCount}`);
    
    // List all users (without passwords)
    if (userCount > 0) {
        const users = await User.find({}).select('firstName lastName email accountType createdAt').limit(5);
        console.log('\n📋 Sample users:');
        users.forEach(user => {
            console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.accountType}`);
        });
    }
    
    process.exit(0);
})
.catch(error => {
    console.error('❌ Database connection error:', error);
    process.exit(1);
});
