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
    let dest = uploadDir;
    // If user is authenticated, create a folder for them
    if (req.user && req.user._id) {
      dest = path.join(uploadDir, req.user._id.toString());
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    // Filename doesn't strictly need user ID prefix anymore if it's in their folder, 
    // but keeping a unique name is good practice.
    cb(null, `${timestamp}${ext}`);
  }
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
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
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File size too large. Maximum 5MB allowed.', 400));
      } else if (err instanceof multer.MulterError) {
        return next(new AppError(err.message, 400));
      } else if (err) {
        return next(err);
      }
    }

    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    next();
  });
};

module.exports = uploadResume;
