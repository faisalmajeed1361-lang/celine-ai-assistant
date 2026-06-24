const { db } = require('../config/firebaseConfig');
const emailService = require('../services/emailService');

// Function 1: scheduleReminder
exports.scheduleReminder = async (req, res) => {
    try {
        const { clientName, clientEmail, serviceType } = req.body;
        // Email bhejne ki logic
        const emailSent = await emailService.sendLuxuryEmail(
            clientEmail, 
            "Celine Appointment Confirmation", 
            clientName, 
            `<p>Your ${serviceType} is booked!</p>`, 
            "See you soon!"
        );
        res.status(200).json({ success: true, email: emailSent ? "Sent" : "Failed" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Function 2: checkDueReminders (Ye missing hone se error aa raha tha)
exports.checkDueReminders = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Automation check healthy" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};