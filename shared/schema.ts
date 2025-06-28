import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.enum(['gardening', 'painting', 'pressure-washing', 'other']),
  message: z.string().min(10, 'Please provide more details about your requirements'),
  location: z.string().min(2, 'Location is required'),
  createdAt: z.date().optional(),
});

// Review schema
export const reviewSchema = z.object({
  id: z.string().optional(),
  customerName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  service: z.enum(['gardening', 'painting', 'pressure-washing']),
  createdAt: z.date().optional(),
});

// Service schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  imageUrl: z.string().optional(),
});

// Create insert schemas
export const insertContactFormSchema = contactFormSchema.omit({ id: true, createdAt: true });
export const insertReviewSchema = reviewSchema.omit({ id: true, createdAt: true });

// Types
export type ContactForm = z.infer<typeof contactFormSchema>;
export type InsertContactForm = z.infer<typeof insertContactFormSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Service = z.infer<typeof serviceSchema>;