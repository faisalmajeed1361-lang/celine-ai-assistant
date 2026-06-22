const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const reminderController = require('../controllers/reminderController');

// Aftercare Routes
router.post('/aftercare', aiController.getAftercare);

// Reminder Routes
router.post('/schedule-reminder', reminderController.scheduleReminder);

// Day 4 Automation Route
router.get('/auto-check', reminderController.checkDueReminders);

module.exports = router;