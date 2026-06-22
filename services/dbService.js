const { db } = require('../config/firebaseConfig');
exports.seedAllServices = async () => {
    const categories = [
        { name: "Nail Care", sub: ["Manicure", "Pedicure", "Gel", "Semi-permanent"] },
        { name: "Hair Removal", sub: ["Full Body", "Legs", "Arms"] },
        { name: "Eyelash", sub: ["Extensions", "Lifts"] },
        { name: "Head Spa", sub: ["Japanese treatment"] },
        { name: "Hair Wellness", sub: ["Scalp treatment", "Hair Repair"] },
        { name: "Shop", sub: ["Beauty Products"] }
    ];

    const batch = db.batch();
    categories.forEach(cat => {
        const docRef = db.collection('service_categories').doc();
        batch.set(docRef, cat);
    });
    await batch.commit();
    return "All Celine Esthetique services seeded to Firestore!";
};