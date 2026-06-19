const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (getApps().length === 0) {
    initializeApp({
        projectId: "celine-ai-assistant" // Aapka project ID
    });
}

const db = getFirestore();

// --- YE LINE ERROR KHATAM KAREGI ---
db.settings({ ignoreUndefinedProperties: true }); 

module.exports = { db };