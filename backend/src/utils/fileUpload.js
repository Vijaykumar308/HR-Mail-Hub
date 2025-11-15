const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('./appError');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log('Filename callback - req.user:', req.user);
    const userId = req.user ? req.user._id : 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${timestamp}${ext}`);
  }
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
  console.log('File filter - file:', file);
  console.log('File filter - mimetype:', file.mimetype);
  
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF files are allowed', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

// Middleware to handle file upload
const uploadResume = (req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  
  upload.single('resume')(req, res, (err) => {
    console.log('Multer error:', err);
    
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File size too large. Maximum 5MB allowed.', 400));
      } else if (err instanceof multer.MulterError) {
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(err);
      }
    }
    
    console.log('After multer middleware - req.file:', req.file);
    console.log('After multer middleware - req.files:', req.files);
    
    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }
    
    next();
  });
};

module.exports = uploadResume;
