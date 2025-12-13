const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log('DB connection successful');

        // We can't easily require the model if it has side effects or complex paths, 
        // but the file structure seems standard.
        // Alternatively, we can access the collection directly via mongoose.

        try {
            const collection = mongoose.connection.collection('resumes');
            const indexes = await collection.indexes();
            console.log('Current Indexes:', indexes);

            const legacyIndex = indexes.find(idx => idx.name === 'userId_1_isActive_1');

            if (legacyIndex) {
                console.log('Found legacy index "userId_1_isActive_1". Dropping it...');
                await collection.dropIndex('userId_1_isActive_1');
                console.log('Legacy index dropped successfully.');
            } else {
                console.log('Legacy index "userId_1_isActive_1" not found.');
            }

        } catch (err) {
            console.error('Error managing indexes:', err);
        }

        console.log('Done.');
        process.exit();
    })
    .catch((err) => {
        console.error('DB connection failed:', err);
        process.exit(1);
    });
