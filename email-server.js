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

// Create transporter for sending emails
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, service, location, message } = req.body;
        
        const contactEmailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: 'RMSolutionsCF62@gmail.com',
            subject: `New Contact Form Submission - ${service} Service`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><em>Submitted from RMT Solutions website</em></p>
            `
        };

        await transporter.sendMail(contactEmailOptions);
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
        
        const reviewEmailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: 'RMSolutionsCF62@gmail.com',
            subject: `New Customer Review - ${rating}/5 Stars`,
            html: `
                <h2>New Customer Review</h2>
                <p><strong>Customer:</strong> ${reviewerName}</p>
                <p><strong>Email:</strong> ${reviewerEmail}</p>
                <p><strong>Service:</strong> ${serviceType}</p>
                <p><strong>Rating:</strong> ${rating}/5 ${stars}</p>
                <p><strong>Review:</strong></p>
                <p>"${reviewText}"</p>
                <hr>
                <p><em>Submitted from RMT Solutions website review form</em></p>
            `
        };

        await transporter.sendMail(reviewEmailOptions);
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