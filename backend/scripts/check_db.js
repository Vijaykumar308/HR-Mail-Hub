const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/user.model');

// Load env vars
dotenv.config({ path: '.env' });

const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/HrMailHub?retryWrites=true&w=majority';

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.error('DB connection error:', err));

const checkUsers = async () => {
    try {
        // Wait for connection
        await new Promise(resolve => setTimeout(resolve, 1000));

        const users = await User.find();
        console.log(`Found ${users.length} users.`);
        users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));

        if (users.length === 0) {
            console.log('Creating a test user...');
            const newUser = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                passwordConfirm: 'password123'
            });
            console.log('Test user created:', newUser.email);
        }
    } catch (err) {
        console.error('Error checking users:', err);
    } finally {
        mongoose.disconnect();
    }
};

checkUsers();
