const HRDirectory = require('../models/hrDirectory.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper function to filter allowed fields for updates
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// @desc   Create new HR contact
// @route  POST /api/v1/hr-directory
// @access Private
exports.createHRContact = catchAsync(async (req, res, next) => {
  // TODO: Add createdBy field back when authentication is re-enabled
  // For now, provide a dummy ObjectId to satisfy validation
  const mongoose = require('mongoose');

  const hrData = {
    ...req.body,
    createdBy: new mongoose.Types.ObjectId('6914ca949078a9271a1a9059') // Dummy ObjectId
  };

  const newHRContact = await HRDirectory.create(hrData);

  res.status(201).json({
    status: 'success',
    data: {
      hrContact: newHRContact
    }
  });
});

// @desc   Get all HR contacts with filtering, sorting, and pagination
// @route  GET /api/v1/hr-directory
// @access Private
exports.getAllHRContacts = catchAsync(async (req, res, next) => {
  // Build query
  const query = { isDeleted: { $ne: true } };

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by industry
  if (req.query.industry) {
    query.industry = req.query.industry;
  }

  // Filter by location (case-insensitive partial match)
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: 'i' };
  }

  // Filter by company size
  if (req.query.companySize) {
    query.companySize = req.query.companySize;
  }

  // Filter by date range (createdAt)
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
  }

  // Filter by resumes shared count
  if (req.query.minResumes || req.query.maxResumes) {
    query.resumesShared = {};
    if (req.query.minResumes) query.resumesShared.$gte = parseInt(req.query.minResumes);
    if (req.query.maxResumes) query.resumesShared.$lte = parseInt(req.query.maxResumes);
  }

  // Search by name or company
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { company: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // TODO: Add user filtering back when authentication is re-enabled
  // Filter by created user (for non-admin users)
  // if (req.user.role !== 'admin') {
  //   query.createdBy = req.user.id;
  // }

  // Execute query with pagination and sorting
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  // Dynamic sorting
  let sort = '-createdAt'; // Default
  if (req.query.sort) {
    sort = req.query.sort.split(',').join(' ');
  }

  const hrContacts = await HRDirectory.find(query)
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await HRDirectory.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: hrContacts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: {
      hrContacts
    }
  });
});

// @desc   Get single HR contact
// @route  GET /api/v1/hr-directory/:id
// @access Private
exports.getHRContact = catchAsync(async (req, res, next) => {
  const query = HRDirectory.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).populate('createdBy', 'name email');

  // TODO: Add user filtering back when authentication is re-enabled
  // Non-admin users can only see their own contacts
  // if (req.user.role !== 'admin') {
  //   query.where('createdBy').equals(req.user.id);
  // }

  const hrContact = await query;

  if (!hrContact) {
    return next(new AppError('No HR contact found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      hrContact
    }
  });
});

// @desc   Update HR contact
// @route  PATCH /api/v1/hr-directory/:id
// @access Private
exports.updateHRContact = catchAsync(async (req, res, next) => {
  // Filter out unwanted fields
  const allowedFields = ['name', 'email', 'company', 'website', 'companySize', 'industry', 'location', 'phone', 'status', 'notes'];
  const filteredBody = filterObj(req.body, ...allowedFields);

  // Find the HR contact first to check permissions
  const existingHRContact = await HRDirectory.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

  if (!existingHRContact) {
    return next(new AppError('No HR contact found with that ID', 404));
  }

  // TODO: Add user ownership check back when authentication is re-enabled
  // Check if user owns this contact or is admin
  // if (existingHRContact.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(new AppError('You can only update your own HR contacts', 403));
  // }

  // Update the contact
  const updatedHRContact = await HRDirectory.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  ).populate('createdBy', 'name email');

  res.status(200).json({
    status: 'success',
    data: {
      hrContact: updatedHRContact
    }
  });
});

// @desc   Delete HR contact
// @route  DELETE /api/v1/hr-directory/:id
// @access Private
exports.deleteHRContact = catchAsync(async (req, res, next) => {
  const hrContact = await HRDirectory.findById(req.params.id);

  if (!hrContact) {
    return next(new AppError('No HR contact found with that ID', 404));
  }

  // TODO: Add user ownership check back when authentication is re-enabled
  // Check if user owns this contact or is admin
  // if (hrContact.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(new AppError('You can only delete your own HR contacts', 403));
  // }

  // Soft delete
  hrContact.isDeleted = true;
  hrContact.deletedAt = Date.now();
  await hrContact.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc   Get HR contact statistics
// @route  GET /api/v1/hr-directory/stats
// @access Private
exports.getHRStats = catchAsync(async (req, res, next) => {
  // TODO: Add user filtering back when authentication is re-enabled
  // const matchCondition = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
  const matchCondition = { isDeleted: { $ne: true } };

  const stats = await HRDirectory.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalContacts: { $sum: 1 },
        activeContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        inactiveContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
        },
        pendingContacts: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        totalResumesShared: { $sum: '$resumesShared' },
        industries: { $addToSet: '$industry' }
      }
    }
  ]);

  const industryStats = await HRDirectory.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || {
        totalContacts: 0,
        activeContacts: 0,
        inactiveContacts: 0,
        pendingContacts: 0,
        totalResumesShared: 0,
        industries: []
      },
      industryStats
    }
  });
});

// @desc   Increment resumes shared count
// @route  PATCH /api/v1/hr-directory/:id/increment-resumes
// @access Private
exports.incrementResumesShared = catchAsync(async (req, res, next) => {
  const hrContact = await HRDirectory.findOne({ _id: req.params.id, isDeleted: { $ne: true } });

  if (!hrContact) {
    return next(new AppError('No HR contact found with that ID', 404));
  }

  // TODO: Add user ownership check back when authentication is re-enabled
  // Check if user owns this contact or is admin
  // if (hrContact.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(new AppError('You can only update your own HR contacts', 403));
  // }

  const updatedHRContact = await HRDirectory.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { resumesShared: 1 },
      $set: { lastContacted: new Date() }
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('createdBy', 'name email');

  res.status(200).json({
    status: 'success',
    data: {
      hrContact: updatedHRContact
    }
  });
});
