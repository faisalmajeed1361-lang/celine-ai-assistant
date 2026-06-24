const { OpenAI } = require('openai');
const { db } = require('../config/firebaseConfig');
const emailService = require('../services/emailService'); // Day 6: Email Service import
require('dotenv').config();

// AI Initialization with Safety Check
const isRealKey = process.env.OPENAI_API_KEY && 
                  process.env.OPENAI_API_KEY.startsWith('sk-') && 
                  !process.env.OPENAI_API_KEY.includes('yahan');

const openai = isRealKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// --- 1. AI Aftercare Assistant (Requirement 51 + Email + DB Save) ---
exports.getAftercare = async (req, res) => {
    try {
        const { serviceType, language = "en", clientName, clientEmail } = req.body;

        let responseData;

        // AI Logic
        if (openai) {
            const langName = language === 'fr' ? 'French' : 'English';
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `You are Celine AI. Provide aftercare in ${langName} in JSON format.` },
                    { role: "user", content: `Aftercare for ${serviceType}` }
                ],
                response_format: { type: "json_object" }
            });
            responseData = JSON.parse(completion.choices[0].message.content);
        } else {
            // Mock Database for 6 Services
            const salonDatabase = {
                "en": {
                    "Japanese Head Spa": { "instructions": ["Relax for the day", "Do not wash hair for 24h"], "products": ["Scalp Serum"], "luxuryTip": "Drink water." },
                    "Nail care": { "instructions": ["Avoid hot water", "Use oil"], "products": ["Celine Nail Oil"], "luxuryTip": "Don't peel the gel." }
                },
                "fr": {
                    "Japanese Head Spa": { "instructions": ["Détendez-vous", "Ne pas laver pendant 24h"], "products": ["Sérum apaisant"], "luxuryTip": "Buvez de l'eau." }
                }
            };
            const langData = salonDatabase[language] || salonDatabase["en"];
            responseData = langData[serviceType] || { instructions: ["General care"], products: ["Basic Kit"], luxuryTip: "Stay glowing!" };
        }

        // --- Day 6: SAVE TO FIRESTORE ---
        const aftercareRecord = {
            clientName: clientName || "Valued Client",
            clientEmail: clientEmail || "no-email",
            serviceType,
            instructions: responseData.instructions,
            luxuryTip: responseData.luxuryTip,
            status: "active",
            createdAt: new Date()
        };
        await db.collection('client_aftercare').add(aftercareRecord);

        // --- Day 6: SEND EMAIL ---
        if (clientEmail && clientEmail !== "no-email") {
            const emailContent = `<ul>${responseData.instructions.map(i => `<li>${i}</li>`).join('')}</ul>`;
            await emailService.sendLuxuryEmail(clientEmail, `Celine Aftercare: ${serviceType}`, clientName, emailContent, responseData.luxuryTip);
        }

        res.status(200).json({ success: true, message: "Aftercare processed, saved and emailed!", ...responseData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 2. AI Review Sentiment + AUTO RESPONSE (Requirement 52) ---
exports.analyzeSentiment = async (req, res) => {
    try {
        const { reviewText, rating } = req.body;
        if (openai) {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ 
                    role: "system", 
                    content: "Analyze sentiment and write a luxury response. JSON { sentiment, response }" 
                }, { role: "user", content: `Review: "${reviewText}", Rating: ${rating}/5` }],
                response_format: { type: "json_object" }
            });
            return res.status(200).json({ success: true, ...JSON.parse(completion.choices[0].message.content) });
        }
        res.status(200).json({ success: true, sentiment: rating >= 4 ? "Positive" : "Neutral", response: "Thank you for your feedback!", mode: "Mock" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 3. AI Skin Analyzer (Requirement 47) ---
exports.analyzeSkin = async (req, res) => {
    try {
        const skinAnalysis = { skinType: "Combination", confidence: 87, recommendedTreatments: ["Hydrating facial"] };
        res.status(200).json({ success: true, analysis: skinAnalysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 4. AI Service Recommender (Requirement 49) ---
exports.recommendService = async (req, res) => {
    try {
        const { area } = req.body;
        let recommendation = area === "nails" ? "Gel Semi-permanent" : "Head Spa";
        res.status(200).json({ success: true, recommendedService: recommendation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 5. AI Price Estimator (Requirement 50) ---
exports.estimatePrice = async (req, res) => {
    try {
        const { serviceName, addOns = [] } = req.body;
        const total = (serviceName === "Head Spa" ? 120 : 50) + (addOns.length * 25);
        res.status(200).json({ success: true, estimatedTotal: `CHF ${total}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 6. AI Nail Design Generator (Requirement 48) ---
exports.generateNailDesign = async (req, res) => {
    try {
        res.status(200).json({ success: true, imageUrl: "https://example.com/ai-nails.jpg", designName: "Celine Elegance" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 7. Reminder System (Requirement 53) ---
exports.sendReminder = async (req, res) => {
    try {
        const { clientName, email } = req.body;
        console.log(`🤖 Auto-Reminder triggered for ${clientName}`);
        res.status(200).json({ success: true, message: `Reminder system active for ${clientName}` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};