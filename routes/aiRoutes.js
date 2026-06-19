const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const reminderController = require('../controllers/reminderController');

// 1. Aftercare Assistant for ALL 6 Services
router.post('/aftercare', aiController.getAftercare);

// 2. Automated Reminder Trigger
router.post('/schedule-reminder', reminderController.scheduleReminder);

module.exports = router;