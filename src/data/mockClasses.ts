export interface MockClassData {
  id: string;
  title: string;
  category: string;
  instructor: string;
  price: number;
  schedule: string;
  location: string;
  city: string;
  image: string;
  spotsLeft: number | null;
  latitude: number;
  longitude: number;
  popular: boolean;
}

export const CATEGORIES = [
  "All Categories",
  "Yoga",
  "HIIT",
  "Pilates",
  "Bootcamp",
  "Tai Chi",
  "Functional",
  "Running",
  "Boxing",
] as const;

export const CITIES = [
  "All Cities",
  "Milano",
  "Roma",
  "Firenze",
  "Torino",
  "Palermo",
  "Bologna",
  "Napoli",
  "Venezia",
] as const;

export const PRICE_FILTERS = [
  "All Prices",
  "Under €15",
  "€15-€20",
  "Over €20",
] as const;

export const MOCK_CLASSES: MockClassData[] = [
  {
    id: "1",
    title: "Morning Yoga in Parco Sempione",
    category: "Yoga",
    instructor: "Sofia Bianchi",
    price: 15,
    schedule: "Tue & Thu, 7:30 AM",
    location: "Parco Sempione, Milano",
    city: "Milano",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 45.4735,
    longitude: 9.1780,
    popular: true,
  },
  {
    id: "2",
    title: "HIIT Workout at Villa Borghese",
    category: "HIIT",
    instructor: "Marco Rossi",
    price: 18,
    schedule: "Mon, Wed & Fri, 6:00 PM",
    location: "Villa Borghese, Roma",
    city: "Roma",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop",
    spotsLeft: 3,
    latitude: 41.9142,
    longitude: 12.4854,
    popular: true,
  },
  {
    id: "3",
    title: "Pilates in Parco delle Cascine",
    category: "Pilates",
    instructor: "Lucia Verdi",
    price: 16,
    schedule: "Sat, 9:00 AM",
    location: "Parco delle Cascine, Firenze",
    city: "Firenze",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 43.7740,
    longitude: 11.2330,
    popular: false,
  },
  {
    id: "4",
    title: "Bootcamp Training by the Beach",
    category: "Bootcamp",
    instructor: "Giovanni Russo",
    price: 20,
    schedule: "Tue & Sat, 8:00 AM",
    location: "Spiaggia di Mondello, Palermo",
    city: "Palermo",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 38.1530,
    longitude: 13.3230,
    popular: true,
  },
  {
    id: "5",
    title: "Evening Tai Chi at Parco Valentino",
    category: "Tai Chi",
    instructor: "Elena Conti",
    price: 14,
    schedule: "Mon & Wed, 7:00 PM",
    location: "Parco del Valentino, Torino",
    city: "Torino",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 45.0550,
    longitude: 7.6870,
    popular: false,
  },
  {
    id: "6",
    title: "Functional Training at Giardini Margherita",
    category: "Functional",
    instructor: "Paolo Ferrara",
    price: 17,
    schedule: "Thu & Sun, 6:30 PM",
    location: "Giardini Margherita, Bologna",
    city: "Bologna",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 44.4870,
    longitude: 11.3540,
    popular: false,
  },
  {
    id: "7",
    title: "Sunrise Running Group",
    category: "Running",
    instructor: "Andrea Monti",
    price: 12,
    schedule: "Daily, 6:00 AM",
    location: "Parco della Pellerina, Torino",
    city: "Torino",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 45.0820,
    longitude: 7.6500,
    popular: false,
  },
  {
    id: "8",
    title: "Sunset Yoga on the Lungomare",
    category: "Yoga",
    instructor: "Chiara Esposito",
    price: 18,
    schedule: "Fri & Sun, 7:30 PM",
    location: "Lungomare Caracciolo, Napoli",
    city: "Napoli",
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 40.8350,
    longitude: 14.2480,
    popular: true,
  },
  {
    id: "9",
    title: "Outdoor Boxing Class",
    category: "Boxing",
    instructor: "Roberto Leone",
    price: 22,
    schedule: "Tue & Thu, 6:00 PM",
    location: "Parco Dora, Torino",
    city: "Torino",
    image:
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop",
    spotsLeft: 2,
    latitude: 45.0900,
    longitude: 7.6650,
    popular: false,
  },
  {
    id: "10",
    title: "Morning HIIT at Parco Nord",
    category: "HIIT",
    instructor: "Alessia Romano",
    price: 16,
    schedule: "Mon & Wed, 7:00 AM",
    location: "Parco Nord, Milano",
    city: "Milano",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop",
    spotsLeft: 5,
    latitude: 45.5150,
    longitude: 9.1900,
    popular: false,
  },
  {
    id: "11",
    title: "Yoga al Lido di Venezia",
    category: "Yoga",
    instructor: "Francesca Moretti",
    price: 20,
    schedule: "Sat & Sun, 8:00 AM",
    location: "Lido di Venezia",
    city: "Venezia",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 45.3800,
    longitude: 12.3600,
    popular: false,
  },
  {
    id: "12",
    title: "Bootcamp al Foro Italico",
    category: "Bootcamp",
    instructor: "Marco Rossi",
    price: 19,
    schedule: "Wed & Fri, 6:30 PM",
    location: "Foro Italico, Roma",
    city: "Roma",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    spotsLeft: null,
    latitude: 41.9290,
    longitude: 12.4600,
    popular: false,
  },
];
