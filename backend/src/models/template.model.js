const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Template must belong to a user'],
        },
        name: {
            type: String,
            required: [true, 'Please provide a template name'],
            trim: true,
            maxlength: [100, 'Template name must be less than 100 characters'],
        },
        subject: {
            type: String,
            required: [true, 'Please provide an email subject'],
            trim: true,
            maxlength: [200, 'Subject must be less than 200 characters'],
        },
        body: {
            type: String,
            required: [true, 'Please provide the email body'],
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one default template per user
templateSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
