const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendLuxuryEmail = async (to, subject, clientName, content, luxuryTip) => {
    try {
        const mailOptions = {
            from: `"Celine Esthetique" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; color: #1A1A1A; border: 2px solid #D4AF37; padding: 20px;">
                    <h2 style="color: #D4AF37;">Celine Esthetique Lausanne</h2>
                    <p>Hello ${clientName},</p>
                    <div style="background: #F9E4E0; padding: 10px;">${content}</div>
                    <p><strong>Tip:</strong> ${luxuryTip}</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", to);
        return true;
    } catch (error) {
        console.error("❌ Nodemailer Error:", error.message);
        return false;
    }
};