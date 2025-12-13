const express = require('express');
const templateController = require('../controllers/template.controller');
const { authenticate, checkPermission } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(authenticate);

router
    .route('/')
    .get(checkPermission('templates', 'read'), templateController.getAllTemplates)
    .post(checkPermission('templates', 'create'), templateController.createTemplate);

router
    .route('/:id')
    .patch(checkPermission('templates', 'edit'), templateController.updateTemplate)
    .delete(checkPermission('templates', 'delete'), templateController.deleteTemplate);

module.exports = router;
