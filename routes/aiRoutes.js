const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// All endpoints now point to aiController
router.post('/aftercare', aiController.getAftercare);
router.post('/analyze-review', aiController.analyzeSentiment);
router.post('/skin-analyze', aiController.analyzeSkin);
router.post('/recommend-service', aiController.recommendService);
router.post('/price-estimate', aiController.estimatePrice);
router.post('/generate-nail-design', aiController.generateNailDesign);

// Reminders
router.post('/schedule-reminder', aiController.scheduleReminder);
router.get('/auto-check', aiController.checkDueReminders);
router.post('/send-reminder', aiController.sendReminder);

module.exports = router;