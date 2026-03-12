export interface InstructorClass {
  id: string;
  title: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  spotsRemaining: number;
  nextSession: string;
}

export interface InstructorReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  comment: string;
  className: string;
}

export interface InstructorProfile {
  id: string;
  name: string;
  avatarUrl: string;
  coverImageUrl: string;
  tagline: string;
  bio: string;
  city: string;
  languages: string[];
  specialties: string[];
  certifications: string[];
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  totalStudents: number;
  responseRate: string;
  responseTime: string;
  joinedDate: string;
  classes: InstructorClass[];
  reviews: InstructorReview[];
  socialLinks?: {
    instagram?: string;
    website?: string;
  };
}

export const MOCK_INSTRUCTOR: InstructorProfile = {
  id: "inst-1",
  name: "Sofia Bianchi",
  avatarUrl:
    "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&h=300&fit=crop&crop=face",
  coverImageUrl:
    "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1400&h=400&fit=crop",
  tagline: "Bringing mindful movement to Rome's most beautiful spaces",
  bio: "I'm a certified RYT-500 yoga instructor with over 8 years of teaching experience across Italy. Born and raised in Rome, I discovered yoga during a transformative trip to Bali in my early twenties and have been dedicated to sharing its benefits ever since. My approach blends traditional yoga philosophy with modern movement science, always emphasising the connection between practitioner and nature.\n\nWhat sets my classes apart is the setting — I believe there's something magical about practising outdoors, surrounded by centuries of history and natural beauty. Whether it's a sunrise flow at Parco degli Acquedotti with the ancient aqueducts as a backdrop, or a gentle evening session in the Borghese gardens, every class is designed to be an experience, not just a workout.\n\nI teach all levels, from complete beginners to advanced practitioners. My classes are intentionally small (max 15 people) so I can offer personalised guidance and modifications. I hold certifications in Vinyasa, Hatha, Yin, and therapeutic yoga, as well as breathwork and meditation facilitation. When I'm not teaching, you'll find me hiking the Apennines or experimenting with plant-based Italian recipes.",
  city: "Roma",
  languages: ["Italian", "English", "Spanish"],
  specialties: ["Vinyasa Yoga", "Hatha Yoga", "Pilates", "Breathwork", "Meditation"],
  certifications: [
    "RYT-500 Yoga Alliance",
    "Certified Pilates Instructor (PMA)",
    "Breathwork Facilitator — Global Professional Breathwork Alliance",
    "First Aid & CPR Certified",
  ],
  yearsExperience: 8,
  rating: 4.9,
  reviewCount: 127,
  totalStudents: 2340,
  responseRate: "98%",
  responseTime: "within 1 hour",
  joinedDate: "March 2024",
  classes: [
    {
      id: "1",
      title: "Sunrise Yoga at Parco degli Acquedotti",
      category: "Yoga",
      city: "Roma",
      price: 18,
      currency: "EUR",
      rating: 4.9,
      reviewCount: 89,
      imageUrl:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
      difficulty: "Beginner",
      spotsRemaining: 6,
      nextSession: "2026-03-17T06:30:00",
    },
    {
      id: "10",
      title: "Evening Flow at Villa Borghese",
      category: "Yoga",
      city: "Roma",
      price: 20,
      currency: "EUR",
      rating: 4.8,
      reviewCount: 24,
      imageUrl:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
      difficulty: "Intermediate",
      spotsRemaining: 4,
      nextSession: "2026-03-18T18:00:00",
    },
    {
      id: "11",
      title: "Weekend Pilates at Giardino degli Aranci",
      category: "Pilates",
      city: "Roma",
      price: 22,
      currency: "EUR",
      rating: 4.7,
      reviewCount: 14,
      imageUrl:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
      difficulty: "Beginner",
      spotsRemaining: 9,
      nextSession: "2026-03-22T09:00:00",
    },
  ],
  reviews: [
    {
      id: "rev-1",
      reviewerName: "Alessia Moretti",
      reviewerAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2026-03-01",
      comment:
        "Absolutely magical experience. Practising yoga with the ancient aqueducts in the background as the sun rises is something everyone should try. Sofia is an incredible instructor — calm, encouraging, and attentive to each person's level.",
      className: "Sunrise Yoga at Parco degli Acquedotti",
    },
    {
      id: "rev-2",
      reviewerName: "Thomas Müller",
      reviewerAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2026-02-22",
      comment:
        "I joined while visiting Rome and it was the highlight of my trip. The park is gorgeous and Sofia makes beginners feel completely at ease. Would book again in a heartbeat.",
      className: "Sunrise Yoga at Parco degli Acquedotti",
    },
    {
      id: "rev-3",
      reviewerName: "Francesca De Luca",
      reviewerAvatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      date: "2026-02-10",
      comment:
        "Great class and beautiful location. The only reason for 4 stars instead of 5 is that I wished it was a bit longer — 75 minutes flies by! The cool-down and savasana at the end are so peaceful.",
      className: "Sunrise Yoga at Parco degli Acquedotti",
    },
    {
      id: "rev-4",
      reviewerName: "Liam O'Connor",
      reviewerAvatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2026-01-28",
      comment:
        "Took the Evening Flow class at Villa Borghese and it was spectacular. Sofia's cueing is precise and her energy is so warm. The sunset through the trees made it unforgettable.",
      className: "Evening Flow at Villa Borghese",
    },
    {
      id: "rev-5",
      reviewerName: "Giulia Marchetti",
      reviewerAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2026-01-15",
      comment:
        "I've been to Sofia's Pilates class three times now and I keep coming back. She really understands alignment and gives the best modifications. The garden setting is a huge bonus — feels like a private retreat.",
      className: "Weekend Pilates at Giardino degli Aranci",
    },
  ],
  socialLinks: {
    instagram: "https://instagram.com/sofiabianchi.yoga",
    website: "https://sofiabianchi.com",
  },
};
