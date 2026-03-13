export interface City {
  id: string;
  name: string;
  nameIT: string;
  slug: string;
  country: string;
  description: string;
  heroImage: string;
  coordinates: { latitude: number; longitude: number };
  latitude: number;
  longitude: number;
  classCount: number;
  instructorCount: number;
  popularCategories: string[];
  averageRating: number;
  featuredTestimonial: {
    quote: string;
    author: string;
    className: string;
    rating: number;
  } | null;
  sellingPoints: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export const MOCK_CITIES: City[] = [
  {
    id: "city-1",
    name: "Rome",
    nameIT: "Roma",
    slug: "roma",
    country: "Italy",
    description:
      "Train among ancient ruins and lush parks in the Eternal City. From Villa Borghese to the Appian Way, Rome offers iconic backdrops for every workout.",
    heroImage:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&h=600&fit=crop",
    coordinates: { latitude: 41.9028, longitude: 12.4964 },
    latitude: 41.9028,
    longitude: 12.4964,
    classCount: 24,
    instructorCount: 8,
    popularCategories: ["Yoga", "HIIT", "Bootcamp"],
    averageRating: 4.8,
    featuredTestimonial: {
      quote:
        "Doing yoga at sunrise in Villa Borghese was one of the most magical experiences of my life.",
      author: "Anna M.",
      className: "Sunrise Yoga at Villa Borghese",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Landmark",
        title: "Train Among History",
        description:
          "Work out with views of ancient aqueducts, Renaissance villas, and world-famous landmarks.",
      },
      {
        icon: "Sun",
        title: "Year-Round Sunshine",
        description:
          "Enjoy outdoor fitness nearly every day with Rome's mild Mediterranean climate.",
      },
      {
        icon: "TreePine",
        title: "Lush Green Parks",
        description:
          "From Villa Borghese to Villa Pamphili, Rome has over 30 parks perfect for training.",
      },
    ],
  },
  {
    id: "city-2",
    name: "Florence",
    nameIT: "Firenze",
    slug: "firenze",
    country: "Italy",
    description:
      "Discover outdoor fitness in the cradle of the Renaissance. Florence's parks and riverbanks provide stunning settings for classes year-round.",
    heroImage:
      "https://images.unsplash.com/photo-1543429258-0b173e04e693?w=1200&h=600&fit=crop",
    coordinates: { latitude: 43.7696, longitude: 11.2558 },
    latitude: 43.7696,
    longitude: 11.2558,
    classCount: 16,
    instructorCount: 5,
    popularCategories: ["Pilates", "Yoga", "Running"],
    averageRating: 4.7,
    featuredTestimonial: {
      quote:
        "Pilates by the Arno with a view of Ponte Vecchio — it doesn't get better than this.",
      author: "Laura S.",
      className: "Pilates in Parco delle Cascine",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Palette",
        title: "Renaissance Scenery",
        description:
          "Exercise surrounded by masterpieces of architecture along the Arno River.",
      },
      {
        icon: "Mountain",
        title: "Tuscan Hills Nearby",
        description:
          "Combine city classes with trail runs in the rolling Tuscan countryside.",
      },
      {
        icon: "Heart",
        title: "Intimate Community",
        description:
          "Florence's smaller size means close-knit fitness groups and personal attention.",
      },
    ],
  },
  {
    id: "city-3",
    name: "Milan",
    nameIT: "Milano",
    slug: "milano",
    country: "Italy",
    description:
      "Stay fit in Italy's fashion and business capital. Milan's sprawling parks and modern waterfront areas offer diverse outdoor training spots.",
    heroImage:
      "https://images.unsplash.com/photo-1520440229-6469a149ac59?w=1200&h=600&fit=crop",
    coordinates: { latitude: 45.4642, longitude: 9.19 },
    latitude: 45.4642,
    longitude: 9.19,
    classCount: 20,
    instructorCount: 7,
    popularCategories: ["Yoga", "HIIT", "Functional"],
    averageRating: 4.6,
    featuredTestimonial: {
      quote:
        "The morning yoga sessions in Parco Sempione are the perfect way to start my workday.",
      author: "Giulia R.",
      className: "Morning Yoga in Parco Sempione",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Building2",
        title: "Urban Parks Oasis",
        description:
          "Escape the city bustle in Parco Sempione, Parco Nord, and the Navigli canals.",
      },
      {
        icon: "Zap",
        title: "High Energy Scene",
        description:
          "Milan's driven culture means top-tier instructors and cutting-edge workouts.",
      },
      {
        icon: "Train",
        title: "Easy Access",
        description:
          "Every training spot is reachable by metro — no excuses to skip class.",
      },
    ],
  },
  {
    id: "city-4",
    name: "Naples",
    nameIT: "Napoli",
    slug: "napoli",
    country: "Italy",
    description:
      "Get moving along the Bay of Naples with Vesuvius as your backdrop. Napoli's seaside promenades and hilltop parks make every workout epic.",
    heroImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=600&fit=crop",
    coordinates: { latitude: 40.8518, longitude: 14.2681 },
    latitude: 40.8518,
    longitude: 14.2681,
    classCount: 12,
    instructorCount: 4,
    popularCategories: ["Yoga", "Bootcamp", "Boxing"],
    averageRating: 4.7,
    featuredTestimonial: {
      quote:
        "Sunset yoga on the Lungomare with Vesuvius in the background — absolutely unforgettable.",
      author: "Marco P.",
      className: "Sunset Yoga on the Lungomare",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Waves",
        title: "Seaside Workouts",
        description:
          "Train along the stunning Lungomare Caracciolo with ocean breezes and bay views.",
      },
      {
        icon: "Mountain",
        title: "Volcanic Backdrop",
        description:
          "Exercise with Mount Vesuvius on the horizon — the most dramatic gym view in Italy.",
      },
      {
        icon: "Pizza",
        title: "Fuel Up Right",
        description:
          "Refuel post-workout with the world's best pizza — you've earned it.",
      },
    ],
  },
  {
    id: "city-5",
    name: "Venice",
    nameIT: "Venezia",
    slug: "venezia",
    country: "Italy",
    description:
      "Experience fitness on the lagoon. Venice and its Lido beach offer unique waterside training environments unlike anywhere else.",
    heroImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=600&fit=crop",
    coordinates: { latitude: 45.4408, longitude: 12.3155 },
    latitude: 45.4408,
    longitude: 12.3155,
    classCount: 8,
    instructorCount: 3,
    popularCategories: ["Yoga", "Pilates", "Tai Chi"],
    averageRating: 4.9,
    featuredTestimonial: {
      quote:
        "Morning yoga on the Lido beach was the highlight of my Venice trip. So peaceful.",
      author: "Sofia T.",
      className: "Yoga al Lido di Venezia",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Ship",
        title: "Lagoon Setting",
        description:
          "Practice on the Lido beach with views across the Venetian lagoon.",
      },
      {
        icon: "Sunrise",
        title: "Magical Mornings",
        description:
          "Early sessions on the water offer unmatched tranquility and golden light.",
      },
      {
        icon: "Sparkles",
        title: "Unique Experience",
        description:
          "No other city on Earth offers outdoor fitness in a setting quite like Venice.",
      },
    ],
  },
  {
    id: "city-6",
    name: "Bologna",
    nameIT: "Bologna",
    slug: "bologna",
    country: "Italy",
    description:
      "Train in Italy's foodie capital. Bologna's portico-lined streets, hilltop sanctuaries, and lush gardens are ideal for outdoor fitness.",
    heroImage:
      "https://images.unsplash.com/photo-1598950473673-c04e48cfc064?w=1200&h=600&fit=crop",
    coordinates: { latitude: 44.4949, longitude: 11.3426 },
    latitude: 44.4949,
    longitude: 11.3426,
    classCount: 10,
    instructorCount: 4,
    popularCategories: ["Functional", "Running", "Yoga"],
    averageRating: 4.6,
    featuredTestimonial: null,
    sellingPoints: [
      {
        icon: "GraduationCap",
        title: "University Energy",
        description:
          "Bologna's vibrant student culture means lively, social fitness sessions.",
      },
      {
        icon: "TreePine",
        title: "Hillside Parks",
        description:
          "Run up to San Luca or train in Giardini Margherita — green spaces everywhere.",
      },
      {
        icon: "Utensils",
        title: "Earn Your Pasta",
        description:
          "With the best food in Italy, you'll have all the motivation to work out.",
      },
    ],
  },
  {
    id: "city-7",
    name: "Turin",
    nameIT: "Torino",
    slug: "torino",
    country: "Italy",
    description:
      "Work out with the Alps as your backdrop. Torino's riverside parks and mountain-view training spots offer an unbeatable fitness experience.",
    heroImage:
      "https://images.unsplash.com/photo-1614094082869-cd4e4b2f44da?w=1200&h=600&fit=crop",
    coordinates: { latitude: 45.0703, longitude: 7.6869 },
    latitude: 45.0703,
    longitude: 7.6869,
    classCount: 18,
    instructorCount: 6,
    popularCategories: ["Running", "Boxing", "Tai Chi"],
    averageRating: 4.7,
    featuredTestimonial: {
      quote:
        "Running along the Po River with snow-capped Alps in the distance — my favorite way to start the day.",
      author: "Davide L.",
      className: "Sunrise Running Group",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Mountain",
        title: "Alpine Views",
        description:
          "Train with stunning views of the snow-capped Alps right from the city parks.",
      },
      {
        icon: "Droplets",
        title: "Riverside Training",
        description:
          "The Po River parks offer flat, scenic running and training paths for all levels.",
      },
      {
        icon: "Trophy",
        title: "Sporting Heritage",
        description:
          "Home of the 2006 Winter Olympics — Torino lives and breathes athletic culture.",
      },
    ],
  },
  {
    id: "city-8",
    name: "Palermo",
    nameIT: "Palermo",
    slug: "palermo",
    country: "Italy",
    description:
      "Train on golden beaches and in Mediterranean gardens. Palermo's warm climate and coastal setting make it a year-round outdoor gym.",
    heroImage:
      "https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=1200&h=600&fit=crop",
    coordinates: { latitude: 38.1157, longitude: 13.3615 },
    latitude: 38.1157,
    longitude: 13.3615,
    classCount: 10,
    instructorCount: 3,
    popularCategories: ["Bootcamp", "Yoga", "HIIT"],
    averageRating: 4.8,
    featuredTestimonial: {
      quote:
        "Bootcamp on Mondello Beach at sunrise is the most energizing thing I've ever done.",
      author: "Valentina G.",
      className: "Bootcamp Training by the Beach",
      rating: 5,
    },
    sellingPoints: [
      {
        icon: "Sun",
        title: "Endless Summer",
        description:
          "With 300+ sunny days a year, Palermo is perfect for outdoor fitness year-round.",
      },
      {
        icon: "Waves",
        title: "Beach Training",
        description:
          "Mondello Beach offers sandy bootcamps and seaside yoga just minutes from the center.",
      },
      {
        icon: "Compass",
        title: "Island Adventure",
        description:
          "Combine your training with Sicily's incredible nature, food, and culture.",
      },
    ],
  },
];
