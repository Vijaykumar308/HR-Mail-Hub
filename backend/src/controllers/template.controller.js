const Template = require('../models/template.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTemplates = catchAsync(async (req, res, next) => {
    const templates = await Template.find({ user: req.user.id }).sort('-updatedAt');

    res.status(200).json({
        status: 'success',
        results: templates.length,
        data: {
            templates,
        },
    });
});

exports.createTemplate = catchAsync(async (req, res, next) => {
    // Check if user already has 3 templates
    const templateCount = await Template.countDocuments({ user: req.user.id });

    if (templateCount >= 3) {
        return next(new AppError('You can only create up to 3 templates.', 400));
    }

    const newTemplate = await Template.create({
        ...req.body,
        user: req.user.id,
    });

    res.status(201).json({
        status: 'success',
        data: {
            template: newTemplate,
        },
    });
});

exports.updateTemplate = catchAsync(async (req, res, next) => {
    const template = await Template.findOne({ _id: req.params.id, user: req.user.id });

    if (!template) {
        return next(new AppError('No template found with that ID', 404));
    }

    // If setting as default, update others first (handled by pre-save hook if using save, but findOneAndUpdate bypasses hooks unless configured)
    // For simplicity and hook execution, we'll use object assignment and save
    Object.assign(template, req.body);

    // If isDefault is being set to true, we need to ensure others are false. 
    // The pre-save hook handles this.

    await template.save();

    res.status(200).json({
        status: 'success',
        data: {
            template,
        },
    });
});

exports.deleteTemplate = catchAsync(async (req, res, next) => {
    const template = await Template.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!template) {
        return next(new AppError('No template found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
