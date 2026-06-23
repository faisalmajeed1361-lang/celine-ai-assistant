const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// 1. Aftercare
router.post('/aftercare', aiController.getAftercare);

// 2. Review Sentiment (Requirement Page 17)
router.post('/analyze-review', aiController.analyzeSentiment);

// 3. Skin Analyze (Requirement Page 16)
router.post('/skin-analyze', aiController.analyzeSkin);

// 4. Reminders
router.post('/send-reminder', aiController.sendReminder);

// Day 5 Additional Features
router.post('/recommend-service', aiController.recommendService);
router.post('/price-estimate', aiController.estimatePrice);
router.post('/generate-nail-design', aiController.generateNailDesign);

module.exports = router;