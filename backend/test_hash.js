const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/user.model');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL || 'mongodb://localhost:27017/hrmailhub';

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log('DB connection successful!');

        try {
            // 1. Create a test user
            console.log('Creating test user...');
            const email = 'test_hash_' + Date.now() + '@example.com';
            const password = 'Password123';

            const user = await User.create({
                name: 'Test Hash',
                email: email,
                password: password,
                passwordConfirm: password
            });
            console.log('User created with ID:', user._id);

            // 2. Verify initial password
            console.log('Verifying initial password...');
            const isCorrectInitial = await user.correctPassword(password, user.password);
            console.log('Initial password correct:', isCorrectInitial);

            // 3. Update password
            console.log('Updating password...');
            const newPassword = 'NewPassword123';
            user.password = newPassword;
            user.passwordConfirm = newPassword;

            await user.save();
            console.log('Password updated and saved.');

            // 4. Verify new password
            // Need to re-fetch user to get the hashed password if save() didn't update the instance (it should)
            // But let's fetch from DB to be sure
            const updatedUser = await User.findById(user._id).select('+password');

            console.log('Verifying new password...');
            const isCorrectNew = await updatedUser.correctPassword(newPassword, updatedUser.password);
            console.log('New password correct:', isCorrectNew);

            // 5. Verify old password (should fail)
            const isCorrectOld = await updatedUser.correctPassword(password, updatedUser.password);
            console.log('Old password correct (should be false):', isCorrectOld);

        } catch (err) {
            console.error('Error:', err);
        } finally {
            await mongoose.disconnect();
            console.log('Disconnected');
        }
    });
