const admin = require('firebase-admin');
// Yahan aapki firebase key aayegi
if (!admin.apps.length) {
    admin.initializeApp();
}
module.exports = admin;