const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  port: process.env.PORT || 4000,
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 60 * 24, // 24 hours
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 30, // 30 days
  },
  // Database
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/HrMailHub?retryWrites=true&w=majority',
    // Removed deprecated options
  },
  // Email
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'noreply@hrmailhub.com',
  },
  // Logging
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs',
  },
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  // Resume Share Limit
  resumeShareLimit: {
    weekly: parseInt(process.env.RESUME_SHARE_LIMIT_WEEKLY, 10) || 3,
  },
};

const config = {
  development: {
    ...baseConfig,
    db: {
      ...baseConfig.db,
      debug: true,
    },
  },
  production: {
    ...baseConfig,
    db: {
      ...baseConfig.db,
      debug: false,
    },
  },
  test: {
    ...baseConfig,
    port: 0, // Let the system pick a random port
    db: {
      ...baseConfig.db,
      uri: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/hrmailhub-test',
    },
  },
};

module.exports = config[env];
