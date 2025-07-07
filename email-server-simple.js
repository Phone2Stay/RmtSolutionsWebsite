const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rmtsolutions.website@gmail.com',
    pass: process.env.EMAIL_PASS || 'temp-password'
  }
});

// Send email function
async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: 'rmtsolutions.website@gmail.com',
      to,
      subject,
      html
    });
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, location, message } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !service || !location || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create email content
    const emailHtml = `
      <h2>New Contact Form Submission - RMT Solutions</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Name:</td><td style="padding: 12px; border: 1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Email:</td><td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Phone:</td><td style="padding: 12px; border: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Service:</td><td style="padding: 12px; border: 1px solid #ddd;">${service}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Location:</td><td style="padding: 12px; border: 1px solid #ddd;">${location}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Message:</td><td style="padding: 12px; border: 1px solid #ddd;">${message}</td></tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Submitted from: <a href="https://rmtsolutions.uk">https://rmtsolutions.uk</a></p>
    `;
    
    // Send email
    const emailSent = await sendEmail(
      'RMSolutionsCF62@gmail.com',
      'New Contact from RMT Solutions Website',
      emailHtml
    );
    
    if (emailSent) {
      res.json({ success: true, message: 'Message sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review form endpoint
app.post('/api/reviews', async (req, res) => {
  try {
    const { customerName, customerEmail, service, rating, comment } = req.body;
    
    // Basic validation
    if (!customerName || !customerEmail || !service || !rating || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Create star rating display
    const stars = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
    
    // Create email content
    const emailHtml = `
      <h2>New Customer Review - RMT Solutions</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Customer Name:</td><td style="padding: 12px; border: 1px solid #ddd;">${customerName}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Email:</td><td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Service:</td><td style="padding: 12px; border: 1px solid #ddd;">${service}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Rating:</td><td style="padding: 12px; border: 1px solid #ddd;">${stars} (${rating}/5)</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Review:</td><td style="padding: 12px; border: 1px solid #ddd;">${comment}</td></tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Submitted from: <a href="https://rmtsolutions.uk">https://rmtsolutions.uk</a></p>
    `;
    
    // Send email
    const emailSent = await sendEmail(
      'RMSolutionsCF62@gmail.com',
      'New Customer Review - RMT Solutions',
      emailHtml
    );
    
    if (emailSent) {
      res.json({ success: true, message: 'Review submitted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
    
  } catch (error) {
    console.error('Review form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`RMT Solutions server running on port ${PORT}`);
  console.log(`Email service configured for: RMSolutionsCF62@gmail.com`);
});