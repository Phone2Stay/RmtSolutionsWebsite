const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Simple email logging function (like LB Interface)
function logEmail(emailData) {
    console.log('='.repeat(50));
    console.log('NEW EMAIL TO: RMSolutionsCF62@gmail.com');
    console.log('FROM:', emailData.from);
    console.log('SUBJECT:', emailData.subject);
    console.log('TIME:', new Date().toLocaleString());
    console.log('-'.repeat(30));
    console.log('CONTENT:');
    console.log(emailData.text || emailData.html);
    console.log('='.repeat(50));
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, service, location, message } = req.body;
        
        const emailContent = `
NEW CONTACT FORM SUBMISSION - ${service} Service

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Location: ${location}

Message:
${message}

Submitted from RMT Solutions website at ${new Date().toLocaleString()}
        `;

        logEmail({
            from: 'RMT Solutions Website',
            subject: `New Contact Form Submission - ${service} Service`,
            text: emailContent
        });
        res.json({ success: true, message: 'Contact form submitted successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ success: false, message: 'Failed to send contact form.' });
    }
});

// Review form endpoint
app.post('/api/review', async (req, res) => {
    try {
        const { reviewerName, reviewerEmail, serviceType, rating, reviewText } = req.body;
        
        const stars = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
        
        const reviewContent = `
NEW CUSTOMER REVIEW - ${rating}/5 Stars

Customer: ${reviewerName}
Email: ${reviewerEmail}
Service: ${serviceType}
Rating: ${rating}/5 ${stars}

Review:
"${reviewText}"

Submitted from RMT Solutions website review form at ${new Date().toLocaleString()}
        `;

        logEmail({
            from: 'RMT Solutions Website',
            subject: `New Customer Review - ${rating}/5 Stars`,
            text: reviewContent
        });
        res.json({ success: true, message: 'Review submitted successfully!' });
    } catch (error) {
        console.error('Review form error:', error);
        res.status(500).json({ success: false, message: 'Failed to send review.' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toUTCString() 
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});