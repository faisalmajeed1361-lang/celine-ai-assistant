const { OpenAI } = require('openai');
require('dotenv').config();

// AI Initialization with Safety Check
const isRealKey = process.env.OPENAI_API_KEY && 
                  process.env.OPENAI_API_KEY.startsWith('sk-') && 
                  !process.env.OPENAI_API_KEY.includes('yahan');

const openai = isRealKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

exports.getAftercare = async (req, res) => {
    try {
        const { serviceType, language = "en" } = req.body; // Default language English hai

        // 1. AGAR OPENAI KEY HAI TO REAL AI USE KARO
        if (openai) {
            const langName = language === 'fr' ? 'French' : 'English';
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `You are Celine AI for a luxury salon in Lausanne. Provide aftercare in ${langName} in JSON format.` },
                    { role: "user", content: `Aftercare for ${serviceType}` }
                ],
                response_format: { type: "json_object" }
            });
            return res.status(200).json({ success: true, data: JSON.parse(completion.choices[0].message.content) });
        }

        // 2. MOCK DATABASE (Agar key nahi hai) - All 6 Services in En & Fr
        const salonDatabase = {
            "en": {
                "Japanese Head Spa": {
                    "instructions": ["Relax for the day", "Do not wash hair for 24h", "Drink water"],
                    "products": ["Scalp Soothing Serum"],
                    "luxuryTip": "Drink chamomile tea."
                },
                "Nail care": {
                    "instructions": ["Avoid hot water for 24h", "Use cuticle oil daily"],
                    "products": ["Celine Nail Oil"]
                },
                "Eyelash extensions": {
                    "instructions": ["Keep dry for 24h", "No oil-based makeup", "Brush daily"],
                    "products": ["Lash Cleanser"]
                },
                "Hair removal": {
                    "instructions": ["No sun for 48h", "Apply aloe vera gel"],
                    "products": ["Soothing Lotion"]
                },
                "Hair wellness": {
                    "instructions": ["Use sulfate-free shampoo", "Weekly hair mask"],
                    "products": ["Repair Mask"]
                },
                "Beauty products": {
                    "instructions": ["Follow product manual", "Store in cool place"],
                    "products": ["Specific to purchase"]
                }
            },
            "fr": {
                "Japanese Head Spa": {
                    "instructions": ["Détendez-vous pour la journée", "Ne pas laver les cheveux pendant 24h"],
                    "products": ["Sérum apaisant pour le cuir chevelu"],
                    "luxuryTip": "Buvez de la tisane à la camomille."
                },
                "Nail care": {
                    "instructions": ["Évitez l'eau chaude pendant 24h", "Huile à cuticules quotidienne"],
                    "products": ["Huile à ongles Celine"]
                },
                "Eyelash extensions": {
                    "instructions": ["Garder au sec pendant 24h", "Pas de maquillage à base d'huile"],
                    "products": ["Nettoyant pour cils"]
                }
                // Mazeed French translations yahan add ho sakti hain...
            }
        };

        // Language aur Service check
        const langData = salonDatabase[language] || salonDatabase["en"];
        const response = langData[serviceType] || { 
            instructions: ["Follow general salon care / Suivez les soins généraux"], 
            products: ["Celine Basic Kit"], 
            reminderDays: [1] 
        };

        res.status(200).json({ 
            success: true, 
            mode: "Mock Mode (Multilingual)",
            language: language,
            service: serviceType,
            ...response 
        });

    } catch (error) {
        console.log("Error logic caught:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Reminder logic (Simulated for Day 4)
exports.sendReminder = async (req, res) => {
    const { clientName, email } = req.body;
    console.log(`🤖 Auto-Reminder triggered for ${clientName} (${email})`);
    res.status(200).json({ success: true, message: `Reminder system active for ${clientName}` });
};