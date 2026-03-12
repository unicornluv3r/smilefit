export interface ClassDetailReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ClassDetail {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string;
    rating: number;
    reviewCount: number;
    classCount: number;
    specialties: string[];
  };
  category: string;
  city: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  price: number;
  currency: string;
  spotsTotal: number;
  spotsRemaining: number;
  duration: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  images: string[];
  schedule: {
    nextSession: string;
    recurring: string;
  };
  tags: string[];
  whatToBring: string[];
  cancellationPolicy: string;
  reviews: ClassDetailReview[];
}

export const MOCK_CLASS_DETAIL: ClassDetail = {
  id: "1",
  title: "Sunrise Yoga at Parco degli Acquedotti",
  description:
    "Start your morning with a rejuvenating yoga flow surrounded by the ancient Roman aqueducts of Parco degli Acquedotti. This stunning open-air setting on the outskirts of Rome offers a uniquely inspiring backdrop — towering stone arches framing the golden sunrise as you move through your practice.\n\nOur sessions blend Vinyasa and Hatha styles, with modifications offered for every level. You'll work on flexibility, core strength, and breathwork while connecting with nature. The class begins with gentle warm-ups and guided meditation, flows through a dynamic standing sequence, and closes with deep stretches and savasana on the grass.\n\nWhether you're a seasoned yogi or trying yoga for the first time, this class offers a welcoming, non-competitive environment. Small group sizes ensure personalised attention from our instructor, and every session ends with a moment of gratitude as the park comes alive around you.",
  instructor: {
    id: "inst-1",
    name: "Sofia Bianchi",
    bio: "Sofia is a certified RYT-500 yoga instructor with over 8 years of teaching experience. Born and raised in Rome, she combines traditional yoga philosophy with modern movement science. She specialises in outdoor classes that connect practitioners with nature and Italy's beautiful landscapes.",
    avatarUrl:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    reviewCount: 127,
    classCount: 342,
    specialties: ["Vinyasa", "Hatha", "Meditation", "Breathwork"],
  },
  category: "Yoga",
  city: "Roma",
  location: {
    name: "Parco degli Acquedotti",
    address: "Via Lemonia, 00174 Roma RM, Italy",
    lat: 41.8556,
    lng: 12.5508,
  },
  price: 18,
  currency: "EUR",
  spotsTotal: 15,
  spotsRemaining: 6,
  duration: 75,
  difficulty: "Beginner",
  images: [
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
  ],
  schedule: {
    nextSession: "2026-03-17T06:30:00",
    recurring: "Every Tuesday & Thursday, 6:30 AM",
  },
  tags: ["Outdoor", "Morning", "All Levels", "Small Group", "Scenic"],
  whatToBring: [
    "Yoga mat",
    "Water bottle",
    "Sunscreen",
    "Comfortable clothing",
    "Light towel",
    "Sneakers or barefoot shoes",
  ],
  cancellationPolicy:
    "Free cancellation up to 24 hours before the session. Cancellations within 24 hours will be charged 50% of the class fee. No-shows are charged the full amount.",
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
    },
  ],
};
