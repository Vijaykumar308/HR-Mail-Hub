const express = require('express');
const hrDirectoryController = require('../controllers/hrDirectory.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// TODO: Add authentication back once CORS is resolved
// router.use(authenticate);

// Public routes (authenticated users only)
router
  .route('/')
  .get(hrDirectoryController.getAllHRContacts)
  .post(hrDirectoryController.createHRContact);

router
  .route('/stats')
  .get(hrDirectoryController.getHRStats);

router
  .route('/:id')
  .get(hrDirectoryController.getHRContact)
  .patch(hrDirectoryController.updateHRContact)
  .delete(hrDirectoryController.deleteHRContact);

router
  .route('/:id/increment-resumes')
  .patch(hrDirectoryController.incrementResumesShared);

module.exports = router;
