import { ContactForm, InsertContactForm, Review, InsertReview } from '../shared/schema.js';

export interface IStorage {
  // Contact forms
  createContactForm(contactForm: InsertContactForm): Promise<ContactForm>;
  getContactForms(): Promise<ContactForm[]>;
  
  // Reviews
  getReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private contactForms: ContactForm[] = [];
  private reviews: Review[] = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely fantastic service! Ryan and Mackenzie transformed our garden completely. Professional, reliable, and great value for money.',
      service: 'gardening',
      createdAt: new Date('2024-06-15'),
    },
    {
      id: '2',
      customerName: 'Mike Williams',
      rating: 5,
      comment: 'Top quality pressure washing service. My driveway looks brand new! Highly recommend RMT Solutions.',
      service: 'pressure-washing',
      createdAt: new Date('2024-06-10'),
    },
    {
      id: '3',
      customerName: 'Emma Davies',
      rating: 5,
      comment: 'Excellent painting job on our exterior walls. Very professional team and finished on time. Will definitely use again.',
      service: 'painting',
      createdAt: new Date('2024-06-05'),
    },
    {
      id: '4',
      customerName: 'David Roberts',
      rating: 5,
      comment: 'Perfect hedge trimming and lawn maintenance. The garden looks immaculate. Great local business!',
      service: 'gardening',
      createdAt: new Date('2024-05-28'),
    },
    {
      id: '5',
      customerName: 'Lisa Thompson',
      rating: 5,
      comment: 'Outstanding service from start to finish. Very competitive prices and exceptional quality work.',
      service: 'pressure-washing',
      createdAt: new Date('2024-05-20'),
    }
  ];

  async createContactForm(contactForm: InsertContactForm): Promise<ContactForm> {
    const newContactForm: ContactForm = {
      ...contactForm,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.contactForms.push(newContactForm);
    return newContactForm;
  }

  async getContactForms(): Promise<ContactForm[]> {
    return this.contactForms;
  }

  async getReviews(): Promise<Review[]> {
    return this.reviews.sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.reviews.push(newReview);
    return newReview;
  }
}

export const storage = new MemStorage();