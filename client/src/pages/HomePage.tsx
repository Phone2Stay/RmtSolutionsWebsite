import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Phone, Mail, MapPin, Scissors, Paintbrush, Droplets, Instagram } from 'lucide-react';
import { Link } from 'wouter';
import rmtLogo from '@assets/image_1751142932571.png';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  service: string;
}

export default function HomePage() {
  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
  });

  const services = [
    {
      id: 'gardening',
      name: 'Gardening Services',
      description: 'Professional garden maintenance, hedge trimming, and lawn care',
      icon: Scissors,
      features: [
        'Hedge trimming and shaping',
        'Grass cutting and lawn maintenance',
        'Garden clearance and cleanup',
        'Planting and landscaping',
        'Tree pruning and care'
      ],
    },
    {
      id: 'painting',
      name: 'Painting Services',
      description: 'Interior and exterior painting for homes and businesses',
      icon: Paintbrush,
      features: [
        'Interior wall painting',
        'Exterior house painting',
        'Fence and decking staining',
        'Commercial painting projects',
        'Surface preparation and priming'
      ],
    },
    {
      id: 'pressure-washing',
      name: 'Pressure Washing',
      description: 'High-quality cleaning for driveways, patios, and exteriors',
      icon: Droplets,
      features: [
        'Driveway and patio cleaning',
        'Building exterior washing',
        'Deck and fence cleaning',
        'Gutter cleaning services',
        'Commercial pressure washing'
      ],
    },
  ];

  const displayReviews = reviews?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={rmtLogo} alt="RMT Solutions" className="h-12 w-12 rounded-full" />
              <div>
                <h1 className="text-xl font-bold text-primary">RMT Solutions</h1>
                <p className="text-sm text-muted-foreground">Barry, Vale of Glamorgan</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
                Reviews
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                <Button variant="outline" size="sm">Contact Us</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Services in
            <span className="text-primary block">Barry, Vale of Glamorgan</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Quality gardening, painting, and pressure washing services by Ryan and Mackenzie. 
            Serving the local community with professional, reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto">
                Get Free Quote
              </Button>
            </Link>
            <a 
              href="https://www.instagram.com/rmt.solutionsltd/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Instagram className="w-4 h-4 mr-2" />
                Follow Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Our Services</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive outdoor maintenance services to homes and businesses 
              throughout Barry and the Vale of Glamorgan.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="service-card">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">What Our Customers Say</h3>
            <p className="text-muted-foreground">
              Read reviews from satisfied customers across Barry and the Vale of Glamorgan
            </p>
          </div>
          
          {reviewsLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {displayReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-current' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">{review.customerName}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <div className="mt-3 text-xs text-primary font-medium capitalize">
                      {review.service.replace('-', ' ')} Service
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8">Ready to Get Started?</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 mb-4" />
              <h4 className="font-semibold mb-2">Call Us</h4>
              <p>+44 7XXX XXX XXX</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 mb-4" />
              <h4 className="font-semibold mb-2">Email Us</h4>
              <p>info@rmtsolutions.co.uk</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 mb-4" />
              <h4 className="font-semibold mb-2">Location</h4>
              <p>Barry, Vale of Glamorgan</p>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Get Your Free Quote Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src={rmtLogo} alt="RMT Solutions" className="h-8 w-8 rounded-full" />
              <div>
                <p className="font-semibold">RMT Solutions</p>
                <p className="text-sm text-muted-foreground">Professional Services in Barry</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.instagram.com/rmt.solutionsltd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <p className="text-sm text-muted-foreground">
                © 2024 RMT Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}