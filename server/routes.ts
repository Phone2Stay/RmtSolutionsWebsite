import express from 'express';
import { insertContactFormSchema, insertReviewSchema } from '../shared/schema.js';
import { storage } from './storage';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email configuration (using Gmail SMTP)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'rmtsolutions.website@gmail.com',
    pass: process.env.EMAIL_PASS || 'fallback-password'
  }
});

// Send email function
async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: 'rmtsolutions.website@gmail.com',
      to,
      subject,
      html
    });
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// Contact form routes
router.post('/api/contact', async (req, res) => {
  try {
    const validatedData = insertContactFormSchema.parse(req.body);
    const contactForm = await storage.createContactForm(validatedData);
    
    // Send email notification
    const emailHtml = `
      <h2>New Contact Form Submission - RMT Solutions</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.name}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.phone}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.service}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Location:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.location}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.message}</td></tr>
      </table>
      <p>Submitted from: https://rmtsolutions.uk</p>
    `;
    
    await sendEmail('RMSolutionsCF62@gmail.com', 'New Contact from RMT Solutions Website', emailHtml);
    
    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(400).json({ error: 'Invalid contact form data' });
  }
});

router.get('/api/contact', async (req, res) => {
  try {
    const contactForms = await storage.getContactForms();
    res.json(contactForms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact forms' });
  }
});

// Reviews routes
router.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await storage.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/api/reviews', async (req, res) => {
  try {
    const validatedData = insertReviewSchema.parse(req.body);
    const review = await storage.createReview(validatedData);
    
    // Send email notification for review
    const stars = '★'.repeat(parseInt(validatedData.rating.toString())) + '☆'.repeat(5 - parseInt(validatedData.rating.toString()));
    const emailHtml = `
      <h2>New Customer Review - RMT Solutions</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.customerName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.customerEmail}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.service}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Rating:</td><td style="padding: 8px; border: 1px solid #ddd;">${stars} (${validatedData.rating}/5)</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Review:</td><td style="padding: 8px; border: 1px solid #ddd;">${validatedData.comment}</td></tr>
      </table>
      <p>Submitted from: https://rmtsolutions.uk</p>
    `;
    
    await sendEmail('RMSolutionsCF62@gmail.com', 'New Customer Review - RMT Solutions', emailHtml);
    
    res.json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(400).json({ error: 'Invalid review data' });
  }
});

export default router;