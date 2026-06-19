const { OpenAI } = require('openai');
require('dotenv').config();

// Check karein ke key asli hai ya nahi (sirf 'sk-' se shuru hone wali aur 'yahan' na ho)
const isRealKey = process.env.OPENAI_API_KEY && 
                  process.env.OPENAI_API_KEY.startsWith('sk-') && 
                  !process.env.OPENAI_API_KEY.includes('yahan');

const openai = isRealKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

exports.getAftercare = async (req, res) => {
    try {
        const { serviceType } = req.body;

        // Agar asli key hai, to OpenAI use karo
        if (openai) {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: `Provide post-treatment care for ${serviceType} in JSON format.` }],
            });
            return res.status(200).json({ success: true, data: JSON.parse(completion.choices[0].message.content) });
        }

        // AGAR KEY NAHI HAI (401 Error se bachne ke liye direct ye output dikhao)
        const salonDatabase = {
            "Japanese Head Spa": {
                "instructions": [
                    "Relax for the rest of the day",
                    "Do not wash hair for 24 hours to let oils absorb",
                    "Avoid high-intensity exercise for 12 hours"
                ],
                "products": ["Scalp Soothing Serum", "Celine Luxury Hair Mask"],
                "reminderDays": [1, 3, 7],
                "luxuryTip": "Drink chamomile tea to enhance the relaxation effect."
            },
            "Nail care": {
                "instructions": ["Avoid hot water for 24h", "Apply cuticle oil daily"],
                "products": ["Cuticle Repair Oil", "Hand Cream"],
                "reminderDays": [1, 5]
            },
            "Eyelash extensions": {
                "instructions": ["No water for 24h", "Do not use oil-based makeup", "Brush daily"],
                "products": ["Lash Cleansing Foam"],
                "reminderDays": [1, 7]
            }
        };

        const response = salonDatabase[serviceType] || { 
            instructions: ["Follow general salon care"], 
            products: ["Celine Basic Care Kit"], 
            reminderDays: [1] 
        };

        res.status(200).json({ 
            success: true, 
            status: "Mock Mode Active (No API Key)",
            service: serviceType,
            ...response 
        });

    } catch (error) {
        console.log("Error logic caught:", error.message);
        res.status(500).json({ success: false, message: "Server error, check terminal" });
    }
};

exports.sendReminder = async (req, res) => {
    res.status(200).json({ success: true, message: "Reminder system active" });
};