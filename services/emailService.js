const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Apni Gmail likhein .env mein
        pass: process.env.EMAIL_PASS  // Gmail App Password
    }
});

exports.sendAftercareEmail = async (clientEmail, clientName, service, instructions) => {
    const mailOptions = {
        from: '"Celine Esthetique" <your-email@gmail.com>',
        to: clientEmail,
        subject: `Aftercare Instructions for your ${service}`,
        html: `
            <h1>Hello ${clientName},</h1>
            <p>Thank you for visiting Celine Esthetique Lausanne.</p>
            <h3>Post-Treatment Care for ${service}:</h3>
            <ul>${instructions.map(i => `<li>${i}</li>`).join('')}</ul>
            <p>We look forward to seeing you again!</p>
        `
    };
    return transporter.sendMail(mailOptions);
};