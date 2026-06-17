// AI Aftercare Logic
exports.getAftercare = async (req, res) => {
    try {
        const { serviceName } = req.body;

        // Document Page 35 ki requirements ke mutabiq response
        const response = {
            instructions: [
                "Keep lashes dry for 24 hours",
                "Avoid oil-based products",
                "Brush daily with spoolie"
            ],
            products: ["Lash sealant", "Gentle cleanser"],
            reminderDays: [1, 3, 7]
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Error in Aftercare Assistant", error });
    }
};

// Reminder Logic
exports.sendReminder = async (req, res) => {
    try {
        const { clientName, appointmentTime } = req.body;
        res.status(200).json({
            success: true,
            message: `Reminder sent to ${clientName} for appointment at ${appointmentTime}`
        });
    } catch (error) {
        res.status(500).json({ message: "Error in Reminder System", error });
    }
};