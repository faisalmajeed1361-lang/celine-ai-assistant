const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const reminderController = require('../controllers/reminderController');

// AI Features
router.post('/aftercare', aiController.getAftercare);
router.post('/analyze-review', aiController.analyzeSentiment);
router.post('/skin-analyze', aiController.analyzeSkin);
router.post('/recommend-service', aiController.recommendService);
router.post('/price-estimate', aiController.estimatePrice);
router.post('/generate-nail-design', aiController.generateNailDesign);

// Reminder Features
router.post('/schedule-reminder', reminderController.scheduleReminder); // Check this function exists
router.get('/auto-check', reminderController.checkDueReminders);      // Check this function exists

module.exports = router;