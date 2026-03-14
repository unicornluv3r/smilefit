export interface MockInstructorSummary {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  city: string;
}

export const MOCK_INSTRUCTORS: MockInstructorSummary[] = [
  {
    id: "inst-1",
    name: "Sofia Bianchi",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    specialty: "Yoga & Pilates",
    rating: 4.9,
    reviewCount: 127,
    city: "Roma",
  },
  {
    id: "inst-2",
    name: "Marco Rossi",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
    specialty: "HIIT & Bootcamp",
    rating: 4.8,
    reviewCount: 95,
    city: "Roma",
  },
  {
    id: "inst-3",
    name: "Lucia Verdi",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    specialty: "Pilates",
    rating: 4.7,
    reviewCount: 68,
    city: "Firenze",
  },
  {
    id: "inst-4",
    name: "Giovanni Russo",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    specialty: "Bootcamp & HIIT",
    rating: 4.8,
    reviewCount: 82,
    city: "Palermo",
  },
  {
    id: "inst-5",
    name: "Elena Conti",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    specialty: "Tai Chi & Yoga",
    rating: 4.9,
    reviewCount: 54,
    city: "Torino",
  },
  {
    id: "inst-6",
    name: "Paolo Ferrara",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
    specialty: "Functional Training",
    rating: 4.6,
    reviewCount: 41,
    city: "Bologna",
  },
  {
    id: "inst-7",
    name: "Andrea Monti",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
    specialty: "Running & Endurance",
    rating: 4.7,
    reviewCount: 73,
    city: "Torino",
  },
  {
    id: "inst-8",
    name: "Chiara Esposito",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    specialty: "Yoga",
    rating: 4.8,
    reviewCount: 89,
    city: "Napoli",
  },
  {
    id: "inst-9",
    name: "Francesca Moretti",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    specialty: "Yoga & Meditation",
    rating: 4.9,
    reviewCount: 36,
    city: "Venezia",
  },
  {
    id: "inst-10",
    name: "Alessia Romano",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    specialty: "HIIT & Cardio",
    rating: 4.6,
    reviewCount: 47,
    city: "Milano",
  },
  {
    id: "inst-11",
    name: "Giulia Ferrari",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    specialty: "Yoga & Meditation",
    rating: 4.8,
    reviewCount: 63,
    city: "Firenze",
  },
  {
    id: "inst-12",
    name: "Luca Moretti",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
    specialty: "HIIT & Bootcamp",
    rating: 4.7,
    reviewCount: 58,
    city: "Milano",
  },
];
