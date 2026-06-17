const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/aftercare
router.post('/aftercare', aiController.getAftercare);

// POST /api/ai/send-reminder
router.post('/send-reminder', aiController.sendReminder);

module.exports = router;