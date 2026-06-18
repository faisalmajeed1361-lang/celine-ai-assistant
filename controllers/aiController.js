// Data for different services (As per Salon requirements)
const serviceData = {
    "Eyelash extensions": {
        instructions: ["Keep lashes dry for 24 hours", "Avoid oil-based products", "Brush daily with spoolie"],
        products: ["Lash sealant", "Gentle cleanser"],
        reminderDays: [1, 3, 7]
    },
    "Nail care": {
        instructions: ["Avoid hot water for 24 hours", "Use cuticle oil daily", "Wear gloves while cleaning"],
        products: ["Cuticle Oil", "Hand Cream"],
        reminderDays: [2, 5]
    },
    "Hydrafacial": {
        instructions: ["Apply SPF 50 daily", "Avoid retinol for 3 days", "Keep skin hydrated"],
        products: ["Hyaluronic Acid", "Mineral Sunscreen"],
        reminderDays: [1, 3]
    }
};

// 1. POST /api/ai/aftercare
exports.getAftercare = async (req, res) => {
    try {
        const { serviceName } = req.body;
        
        // Agar service list mein hai to uska data do, warna default
        const data = serviceData[serviceName] || {
            instructions: ["Follow general skincare routine", "Stay hydrated"],
            products: ["Moisturizer", "SPF"],
            reminderDays: [1]
        };

        res.status(200).json({
            success: true,
            service: serviceName,
            ...data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 2. POST /api/ai/send-reminder
exports.sendReminder = async (req, res) => {
    try {
        const { clientName, phoneNumber, appointmentTime, serviceType } = req.body;

        // Yahan hum simulation kar rahe hain ke Firebase Function trigger ho gaya hai
        console.log(`Sending WhatsApp to ${phoneNumber}: Hi ${clientName}, your ${serviceType} is at ${appointmentTime}`);

        res.status(200).json({
            success: true,
            message: `Reminder scheduled for ${clientName}`,
            details: { phoneNumber, appointmentTime, serviceType }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Reminder failed" });
    }
};