const express = require('express');
const templateController = require('../controllers/template.controller');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(authenticate);

router
    .route('/')
    .get(templateController.getAllTemplates)
    .post(templateController.createTemplate);

router
    .route('/:id')
    .patch(templateController.updateTemplate)
    .delete(templateController.deleteTemplate);

module.exports = router;
