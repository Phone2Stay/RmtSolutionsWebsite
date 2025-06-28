import express from 'express';
import { insertContactFormSchema, insertReviewSchema } from '@shared/schema';
import { storage } from './storage';

const router = express.Router();

// Contact form routes
router.post('/api/contact', async (req, res) => {
  try {
    const validatedData = insertContactFormSchema.parse(req.body);
    const contactForm = await storage.createContactForm(validatedData);
    res.json(contactForm);
  } catch (error) {
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
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: 'Invalid review data' });
  }
});

export default router;