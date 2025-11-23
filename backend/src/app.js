const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// Custom sanitization middleware
const sanitize = require('xss');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const config = require('./config/config');
const logger = require('./utils/logger');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorHandler');

// Import routes
const apiRoutes = require('./routes');
const path = require('path');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Enable CORS first
app.use(cors({
  origin: config.cors.origin,
  methods: config.cors.methods,
  credentials: config.cors.credentials
}));

// Set security HTTP headers
app.use(helmet());

// Request logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Log all requests for debugging - must be after body parser
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// Custom NoSQL injection and XSS protection
app.use((req, res, next) => {
  // Skip for auth routes to prevent issues with password hashing
  if (req.originalUrl.startsWith('/api/v1/')) {
    return next();
  }

  // Sanitize request body
  if (req.body) {
    req.body = sanitizeRequestData(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeRequestData(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeRequestData(req.params);
  }

  next();
});

// Helper function to sanitize data
function sanitizeRequestData(data) {
  if (!data) return data;

  const result = Array.isArray(data) ? [] : {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    if (typeof value === 'string') {
      // Basic XSS protection - remove script tags and dangerous characters
      result[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[<>'"\/]/g, '');
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects and arrays
      result[key] = sanitizeRequestData(value);
    } else {
      result[key] = value;
    }
  });

  return result;
}

// Prevent parameter pollution
app.use(hpp({
  whitelist: []
}));

// Rate limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Compression
app.use(compression());

// 3) ROUTES
// API v1 routes
const v1Router = express.Router();
v1Router.use('/auth', require('./routes/index'));
v1Router.use('/users', require('./routes/user.routes'));
v1Router.use('/resumes', require('./routes/resume.routes'));
v1Router.use('/hr-directory', require('./routes/hrDirectory.routes'));
v1Router.use('/templates', require('./routes/template.routes'));
app.use('/api/v1', v1Router);

// 4) Serve static files from uploads directory
const uploadsDir = path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsDir));

// Serve resume files with proper caching
app.use('/resumes', express.static(path.join(uploadsDir, 'resumes'), {
  setHeaders: (res, path) => {
    // Cache control for resume files (1 day)
    res.set('Cache-Control', 'public, max-age=86400');
  }
}));

// Handle 404 - Not Found
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
