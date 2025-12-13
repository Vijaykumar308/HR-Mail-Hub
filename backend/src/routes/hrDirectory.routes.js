const express = require('express');
const hrDirectoryController = require('../controllers/hrDirectory.controller');
const { authenticate, authorize, checkPermission } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

// Public routes (authenticated users only)
router
  .route('/')
  .get(checkPermission('hrDirectory', 'read'), hrDirectoryController.getAllHRContacts)
  .post(checkPermission('hrDirectory', 'create'), hrDirectoryController.createHRContact);

router
  .route('/stats')
  .get(checkPermission('hrDirectory', 'read'), hrDirectoryController.getHRStats);

router
  .route('/:id')
  .get(checkPermission('hrDirectory', 'read'), hrDirectoryController.getHRContact)
  .patch(checkPermission('hrDirectory', 'edit'), hrDirectoryController.updateHRContact)
  .delete(checkPermission('hrDirectory', 'delete'), hrDirectoryController.deleteHRContact);

router
  .route('/:id/increment-resumes')
  .patch(checkPermission('hrDirectory', 'edit'), hrDirectoryController.incrementResumesShared);

module.exports = router;
