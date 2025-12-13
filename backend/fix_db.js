const mongoose = require('mongoose');
const path = require('path');

// Use the app's config to ensure we get the correct DB URI
const config = require('./src/config/config');

console.log('Starting fix_db.js');
console.log('Using DB URI from config:', config.db.uri);

if (!config.db.uri) {
    console.error('DB URI is missing in config');
    process.exit(1);
}

mongoose
    .connect(config.db.uri)
    .then(async () => {
        console.log('DB connection successful');

        try {
            const collection = mongoose.connection.collection('resumes');
            const indexes = await collection.indexes();
            console.log('Current Indexes:', indexes.map(i => i.name));

            const legacyIndexName = 'userId_1_isActive_1';
            const legacyIndex = indexes.find(idx => idx.name === legacyIndexName);

            if (legacyIndex) {
                console.log(`Found legacy index "${legacyIndexName}". Dropping it...`);
                await collection.dropIndex(legacyIndexName);
                console.log('Legacy index dropped successfully.');
            } else {
                console.log(`Legacy index "${legacyIndexName}" not found. Indexes are clean.`);
            }

        } catch (err) {
            console.error('Error managing indexes:', err);
        }

        console.log('Finished.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('DB connection failed:', err);
        process.exit(1);
    });
