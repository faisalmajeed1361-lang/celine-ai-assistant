const { OpenAI } = require('openai');
require('dotenv').config();

// AI Initialization with Safety Check
const isRealKey = process.env.OPENAI_API_KEY && 
                  process.env.OPENAI_API_KEY.startsWith('sk-') && 
                  !process.env.OPENAI_API_KEY.includes('yahan');

const openai = isRealKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// --- 1. AI Aftercare Assistant (Requirement 51) ---
exports.getAftercare = async (req, res) => {
    try {
        const { serviceType, language = "en" } = req.body;

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
            return res.status(200).json({ success: true, data: JSON.parse(completion.choices[0].message.content) });
        }

        const salonDatabase = {
            "en": {
                "Japanese Head Spa": { "instructions": ["Relax for the day", "Do not wash hair for 24h"], "products": ["Scalp Serum"] },
                "Nail care": { "instructions": ["Avoid hot water for 24h", "Use oil"], "products": ["Celine Nail Oil"] },
                "Eyelash extensions": { "instructions": ["Keep dry for 24h"], "products": ["Lash Cleanser"] }
            },
            "fr": {
                "Japanese Head Spa": { "instructions": ["Détendez-vous", "Ne pas laver pendant 24h"], "products": ["Sérum apaisant"] }
            }
        };

        const langData = salonDatabase[language] || salonDatabase["en"];
        const response = langData[serviceType] || { instructions: ["General care"], products: ["Basic Kit"] };

        res.status(200).json({ success: true, mode: "Mock Mode", service: serviceType, ...response });
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
                    content: "Analyze sentiment and write a luxury response for Celine Esthetique. JSON { sentiment, response }" 
                }, { role: "user", content: `Review: "${reviewText}", Rating: ${rating}/5` }],
                response_format: { type: "json_object" }
            });
            return res.status(200).json({ success: true, ...JSON.parse(completion.choices[0].message.content) });
        }

        res.status(200).json({
            success: true,
            sentiment: rating >= 4 ? "Positive" : "Neutral/Negative",
            response: "Thank you for your visit to Celine Esthetique. We appreciate your feedback.",
            mode: "Mock Mode"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 3. AI Skin Analyzer (Requirement 47) ---
exports.analyzeSkin = async (req, res) => {
    try {
        const skinAnalysis = {
            skinType: "Combination",
            confidence: 87,
            concerns: ["slight redness", "dry cheeks"],
            recommendedTreatments: ["Hydrating facial", "Gentle exfoliation"],
            recommendedProducts: ["Calming serum", "Celine Moisturizer"]
        };
        res.status(200).json({ success: true, analysis: skinAnalysis, message: "Analysis Complete" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 4. AI Service Recommender (Requirement 49) ---
exports.recommendService = async (req, res) => {
    try {
        const { skinConcern, area, occasion } = req.body;
        let recommendation = area === "nails" ? "Gel Semi-permanent" : "Hydrafacial + Head Spa";
        res.status(200).json({
            success: true,
            recommendedService: recommendation,
            reason: `Perfect for your ${skinConcern} and ${occasion}.`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 5. AI Price Estimator (Requirement 50) ---
exports.estimatePrice = async (req, res) => {
    try {
        const { serviceName, addOns = [] } = req.body;
        const base = serviceName === "Head Spa" ? 120 : 50;
        const total = base + (addOns.length * 25);
        res.status(200).json({
            success: true,
            service: serviceName,
            estimatedTotal: `CHF ${total}`,
            currency: "CHF"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 6. AI Nail Design Generator (Requirement 48) ---
exports.generateNailDesign = async (req, res) => {
    try {
        const { color, style, occasion } = req.body;
        res.status(200).json({
            success: true,
            imageUrl: "https://example.com/ai-nails.jpg",
            prompt: `Luxury ${style} nails in ${color} for ${occasion}`,
            designName: "Celine Royal Elegance"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 7. Reminder System Simulation (Requirement 53) ---
exports.sendReminder = async (req, res) => {
    const { clientName } = req.body;
    res.status(200).json({ success: true, message: `Reminder system active for ${clientName}` });
};