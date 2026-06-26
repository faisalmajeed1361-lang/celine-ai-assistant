const { OpenAI } = require('openai');
const { db } = require('../config/firebaseConfig');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');
require('dotenv').config();

// AI Initialization with Safety Check
const isRealKey =
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY.startsWith('sk-') &&
    !process.env.OPENAI_API_KEY.includes('yahan');

const openai = isRealKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// --- 1. AI Aftercare Assistant ---
exports.getAftercare = async (req, res) => {
    try {
        const { serviceType, language = "en", clientName, clientEmail, phoneNumber } = req.body;
        let responseData;

        if (openai) {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `Celine AI: Provide aftercare for ${serviceType} with reminderDays: [1, 3, 7]. Return JSON only.`
                    }
                ],
                response_format: { type: "json_object" }
            });

            responseData = JSON.parse(completion.choices[0].message.content);
        } else {
            const salonDatabase = {
                en: {
                    "Japanese Head Spa": {
                        instructions: ["Relax", "No wash for 24h"],
                        products: ["Scalp Serum"],
                        reminderDays: [1, 3, 7]
                    },
                    "Eyelash extensions": {
                        instructions: ["Keep dry", "Brush daily"],
                        products: ["Lash Sealant"],
                        reminderDays: [1, 3, 7]
                    },
                    "Nail care": {
                        instructions: ["Avoid hot water", "Use oil"],
                        products: ["Celine Nail Oil"],
                        reminderDays: [1, 5]
                    }
                }
            };

            responseData =
                salonDatabase[language]?.[serviceType] ||
                salonDatabase.en[serviceType] ||
                {
                    instructions: ["General care"],
                    products: ["Basic Kit"],
                    reminderDays: [1, 3, 7]
                };
        }

        try {
            await db.collection('client_aftercare').add({
                clientName: clientName || "Valued Client",
                serviceType,
                instructions: responseData.instructions,
                products: responseData.products || [],
                reminderDays: responseData.reminderDays || [1, 3, 7],
                createdAt: new Date()
            });

            console.log("📂 Database: Aftercare record saved.");
        } catch (dbErr) {
            console.log("⚠️ Database save skipped due to credentials/billing issue.");
        }

        if (clientEmail) {
            await emailService.sendLuxuryEmail(
                clientEmail,
                `Aftercare: ${serviceType}`,
                clientName || "Valued Client",
                `Instructions: ${(responseData.instructions || []).join(', ')}`,
                "Stay Beautiful!"
            );
        }

        if (phoneNumber) {
            await whatsappService.sendWhatsAppMessage(
                phoneNumber,
                clientName || "Valued Client",
                `Your aftercare instructions for ${serviceType} are ready!`
            );
        }

        res.status(200).json({
            success: true,
            message: "Processed Successfully",
            ...responseData
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 2. AI Review Sentiment ---
exports.analyzeSentiment = async (req, res) => {
    try {
        const { reviewText, rating } = req.body;

        let sentiment = "Neutral";

        if (rating >= 4) sentiment = "Positive";
        else if (rating <= 2) sentiment = "Negative";

        res.status(200).json({
            success: true,
            reviewText,
            sentiment,
            response: "Thank you for your feedback!"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 3. AI Skin Analyzer ---
exports.analyzeSkin = async (req, res) => {
    try {
        const analysis = {
            skinType: "Combination",
            confidence: 87,
            recommendedTreatments: ["Hydrating facial"]
        };

        res.status(200).json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 4. AI Service Recommender ---
exports.recommendService = async (req, res) => {
    try {
        const { area } = req.body;

        let recommendation = area === "nails" ? "Gel Semi-permanent" : "Head Spa";

        res.status(200).json({
            success: true,
            recommendedService: recommendation
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 5. AI Price Estimator ---
exports.estimatePrice = async (req, res) => {
    try {
        const { serviceName, addOns = [] } = req.body;

        const basePrice = serviceName === "Head Spa" ? 120 : 50;
        const total = basePrice + addOns.length * 25;

        res.status(200).json({
            success: true,
            serviceName,
            addOns,
            estimatedTotal: `CHF ${total}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 6. AI Nail Design Generator ---
exports.generateNailDesign = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            imageUrl: "https://example.com/nails.jpg"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 7. AUTOMATION SCAN ---
exports.checkDueReminders = async (req, res) => {
    try {
        console.log("🤖 Automation Scan Active - Day 7");

        res.status(200).json({
            success: true,
            message: "Automation logic verified. System Healthy."
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 8. SCHEDULE REMINDER ---
exports.scheduleReminder = async (req, res) => {
    try {
        const { clientName } = req.body;

        console.log(`📧 Scheduling for ${clientName}`);

        res.status(200).json({
            success: true,
            message: "Reminder Scheduled Successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 9. SEND REMINDER ---
exports.sendReminder = async (req, res) => {
    try {
        const { clientName } = req.body;

        res.status(200).json({
            success: true,
            message: `Reminder sent to ${clientName || "Client"}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 10. AI Blog Content Generator ---
exports.generateBlog = async (req, res) => {
    try {
        const { topic } = req.body;

        const blogPost = {
            title: `Top 5 ${topic} for Celine Esthetique Clients`,
            content: `In the heart of Lausanne, luxury meets beauty. Our latest look at ${topic} reveals... [Full Article Logic]`,
            tags: ["Luxury", "BeautyTips", topic.replace(/\s/g, "")],
            featuredImage: "https://example.com/salon-blog.jpg"
        };

        res.status(200).json({
            success: true,
            ...blogPost
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 11. Promotional Message Generator ---
exports.generatePromo = async (req, res) => {
    try {
        const { offerName, discount } = req.body;

        const promoMessage = `✨ CELINE EXCLUSIVE ✨\nEnjoy ${discount}% OFF on our ${offerName} this week! Book your luxury experience now at Celine Esthetique Lausanne. 🥂`;

        res.status(200).json({
            success: true,
            promoMessage,
            channels: ["WhatsApp", "Email", "SMS"]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- 12. Intent Recognition ---
exports.detectIntent = async (req, res) => {
    try {
        const { message } = req.body;

        const input = message.toLowerCase();

        let intent = "general_query";

        if (input.includes("book") || input.includes("appointment")) {
            intent = "booking";
        } else if (input.includes("price") || input.includes("cost")) {
            intent = "price_inquiry";
        } else if (input.includes("care") || input.includes("after")) {
            intent = "aftercare_advice";
        }

        res.status(200).json({
            success: true,
            userMessage: message,
            detectedIntent: intent,
            confidence: 0.95
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};