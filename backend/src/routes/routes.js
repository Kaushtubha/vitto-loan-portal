const express = require('express');
const router = express.Router();

const {
  createApplication,
  getApplications,
  updateApplicationStatus,
  getSummary,
} = require('../controllers/applicationController');

const {
  validateCreateApplication,
  validateUpdateStatus,
} = require('../middlewares/validation');

// Loan Applications Routes
router.post('/applications', validateCreateApplication, createApplication);
router.get('/applications', getApplications);
router.patch('/applications/:id/status', validateUpdateStatus, updateApplicationStatus);

// Dashboard Summary Route
router.get('/summary', getSummary);

module.exports = router;
