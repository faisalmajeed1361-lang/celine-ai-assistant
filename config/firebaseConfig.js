const { initializeApp, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let db;

try {
    // 1. App Initialize karein
    if (getApps().length === 0) {
        initializeApp({
            projectId: "celine-ai-assistant" 
        });
    }

    // 2. Firestore connect karne ki koshish karein
    db = getFirestore();
    
    // --- YE LINE UNDEFINED ERROR KHATAM KAREGI ---
    db.settings({ ignoreUndefinedProperties: true }); 
    
    console.log("✅ Celine AI: Firebase Standard Mode Active");

} catch (error) {
    // 3. Agar Credentials nahi miltay toh Server crash nahi hoga, Simulation chalay ga
    console.log("⚠️ Firebase Credentials not found. Switching to Simulation Mode.");
    
    db = {
        collection: (name) => ({
            add: async (data) => {
                console.log(`📂 [DB SIMULATION] Data saved to ${name}:`, data);
                return { id: "sim-id-" + Math.random().toString(36).substr(2, 9) };
            },
            doc: (id) => ({
                update: async (updateData) => console.log(`📝 [DB SIMULATION] Updated doc ${id}`),
                get: async () => ({ exists: true, data: () => ({}) })
            }),
            where: () => db.collection(name), // Chainable method simulation
            limit: () => db.collection(name),
            get: async () => ({ empty: true, forEach: () => {} })
        }),
        settings: () => {} // Empty function taake settings crash na karein
    };
}

module.exports = { db };