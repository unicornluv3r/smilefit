// Mock data for the instructor dashboard
// Used as fallback when Supabase returns no data

export interface DashboardBooking {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  className: string;
  classId: string;
  sessionDate: string;
  sessionTime: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "completed" | "cancelled" | "no_show";
  bookedAt: string;
  confirmationCode: string;
}

export interface DashboardClass {
  id: string;
  title: string;
  category: string;
  city: string;
  price: number;
  image: string;
  isActive: boolean;
  totalBookings: number;
  upcomingSessions: number;
  averageRating: number;
  totalRevenue: number;
}

export interface DashboardReview {
  id: string;
  studentName: string;
  studentAvatar: string | null;
  className: string;
  classId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStudent {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
  favoriteClass: string;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface DailyBookings {
  date: string;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface MonthlyEarnings {
  month: string;
  earnings: number;
}

// ─── Helper: generate dates relative to "today" ─────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function hoursFromNow(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() + n);
  return d.toISOString();
}

// ─── Mock instructor classes ─────────────────────────────────────────

export const MOCK_DASHBOARD_CLASSES: DashboardClass[] = [
  {
    id: "dc-1",
    title: "Sunrise Yoga at Parco degli Acquedotti",
    category: "Yoga",
    city: "Roma",
    price: 18,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    isActive: true,
    totalBookings: 87,
    upcomingSessions: 4,
    averageRating: 4.9,
    totalRevenue: 1566,
  },
  {
    id: "dc-2",
    title: "Evening Flow at Villa Borghese",
    category: "Yoga",
    city: "Roma",
    price: 20,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    isActive: true,
    totalBookings: 64,
    upcomingSessions: 3,
    averageRating: 4.7,
    totalRevenue: 1280,
  },
  {
    id: "dc-3",
    title: "Weekend Pilates at Giardino degli Aranci",
    category: "Pilates",
    city: "Roma",
    price: 22,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    isActive: true,
    totalBookings: 52,
    upcomingSessions: 2,
    averageRating: 4.8,
    totalRevenue: 1144,
  },
  {
    id: "dc-4",
    title: "HIIT in the Park",
    category: "HIIT",
    city: "Roma",
    price: 16,
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop",
    isActive: false,
    totalBookings: 23,
    upcomingSessions: 0,
    averageRating: 4.5,
    totalRevenue: 368,
  },
  {
    id: "dc-5",
    title: "Morning Meditation at Trastevere",
    category: "Yoga",
    city: "Roma",
    price: 15,
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&h=400&fit=crop",
    isActive: true,
    totalBookings: 31,
    upcomingSessions: 2,
    averageRating: 4.6,
    totalRevenue: 465,
  },
];

// ─── Mock bookings ───────────────────────────────────────────────────

export const MOCK_DASHBOARD_BOOKINGS: DashboardBooking[] = [
  {
    id: "db-1",
    studentName: "Giulia Marchetti",
    studentEmail: "giulia@example.com",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    sessionDate: daysFromNow(1),
    sessionTime: "06:30",
    guests: 2,
    totalPrice: 39.6,
    status: "confirmed",
    bookedAt: daysAgo(2),
    confirmationCode: "SF-A7K3M2",
  },
  {
    id: "db-2",
    studentName: "Luca Bianchi",
    studentEmail: "luca.b@example.com",
    studentAvatar: null,
    className: "Evening Flow at Villa Borghese",
    classId: "dc-2",
    sessionDate: daysFromNow(2),
    sessionTime: "18:00",
    guests: 1,
    totalPrice: 22,
    status: "confirmed",
    bookedAt: daysAgo(1),
    confirmationCode: "SF-P9X1B4",
  },
  {
    id: "db-3",
    studentName: "Marco De Luca",
    studentEmail: "marco.dl@example.com",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    sessionDate: daysFromNow(1),
    sessionTime: "06:30",
    guests: 1,
    totalPrice: 19.8,
    status: "confirmed",
    bookedAt: daysAgo(1),
    confirmationCode: "SF-T4W8N6",
  },
  {
    id: "db-4",
    studentName: "Elena Ricci",
    studentEmail: "elena.r@example.com",
    studentAvatar: null,
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "dc-3",
    sessionDate: daysFromNow(4),
    sessionTime: "09:00",
    guests: 2,
    totalPrice: 48.4,
    status: "confirmed",
    bookedAt: daysAgo(3),
    confirmationCode: "SF-L2R5J8",
  },
  {
    id: "db-5",
    studentName: "Chiara Colombo",
    studentEmail: "chiara.c@example.com",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    sessionDate: daysAgo(3),
    sessionTime: "06:30",
    guests: 1,
    totalPrice: 19.8,
    status: "completed",
    bookedAt: daysAgo(8),
    confirmationCode: "SF-D8F3Q1",
  },
  {
    id: "db-6",
    studentName: "Alessio Ferrara",
    studentEmail: "alessio.f@example.com",
    studentAvatar: null,
    className: "Evening Flow at Villa Borghese",
    classId: "dc-2",
    sessionDate: daysAgo(5),
    sessionTime: "18:00",
    guests: 3,
    totalPrice: 66,
    status: "completed",
    bookedAt: daysAgo(10),
    confirmationCode: "SF-H6V9C5",
  },
  {
    id: "db-7",
    studentName: "Valentina Moretti",
    studentEmail: "vale.m@example.com",
    studentAvatar: null,
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "dc-3",
    sessionDate: daysAgo(7),
    sessionTime: "09:00",
    guests: 1,
    totalPrice: 24.2,
    status: "completed",
    bookedAt: daysAgo(12),
    confirmationCode: "SF-K3N7P2",
  },
  {
    id: "db-8",
    studentName: "Francesco Romano",
    studentEmail: "francesco.r@example.com",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    sessionDate: daysAgo(2),
    sessionTime: "06:30",
    guests: 1,
    totalPrice: 19.8,
    status: "cancelled",
    bookedAt: daysAgo(6),
    confirmationCode: "SF-Q8R4T1",
  },
  {
    id: "db-9",
    studentName: "Sofia Esposito",
    studentEmail: "sofia.e@example.com",
    studentAvatar: null,
    className: "Morning Meditation at Trastevere",
    classId: "dc-5",
    sessionDate: daysFromNow(3),
    sessionTime: "07:00",
    guests: 1,
    totalPrice: 16.5,
    status: "confirmed",
    bookedAt: daysAgo(1),
    confirmationCode: "SF-W2X6V9",
  },
  {
    id: "db-10",
    studentName: "Andrea Conti",
    studentEmail: "andrea.c@example.com",
    studentAvatar: null,
    className: "Evening Flow at Villa Borghese",
    classId: "dc-2",
    sessionDate: daysAgo(10),
    sessionTime: "18:00",
    guests: 2,
    totalPrice: 44,
    status: "completed",
    bookedAt: daysAgo(15),
    confirmationCode: "SF-M5J8L3",
  },
  {
    id: "db-11",
    studentName: "Giulia Marchetti",
    studentEmail: "giulia@example.com",
    studentAvatar: null,
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "dc-3",
    sessionDate: daysAgo(14),
    sessionTime: "09:00",
    guests: 1,
    totalPrice: 24.2,
    status: "completed",
    bookedAt: daysAgo(20),
    confirmationCode: "SF-N4P7R2",
  },
  {
    id: "db-12",
    studentName: "Luca Bianchi",
    studentEmail: "luca.b@example.com",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    sessionDate: daysAgo(20),
    sessionTime: "06:30",
    guests: 1,
    totalPrice: 19.8,
    status: "completed",
    bookedAt: daysAgo(25),
    confirmationCode: "SF-B9C2D5",
  },
];

// ─── Mock reviews ────────────────────────────────────────────────────

export const MOCK_DASHBOARD_REVIEWS: DashboardReview[] = [
  {
    id: "dr-1",
    studentName: "Giulia Marchetti",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    rating: 5,
    comment: "Absolutely magical experience! The sunrise over the aqueducts is breathtaking, and Sofia's guidance made the whole session perfect. I'll be back every week.",
    createdAt: daysAgo(3),
  },
  {
    id: "dr-2",
    studentName: "Alessio Ferrara",
    studentAvatar: null,
    className: "Evening Flow at Villa Borghese",
    classId: "dc-2",
    rating: 5,
    comment: "Best yoga class I've ever attended. The villa gardens at sunset create such a peaceful atmosphere. Sofia really knows how to create a calming environment.",
    createdAt: daysAgo(5),
  },
  {
    id: "dr-3",
    studentName: "Elena Ricci",
    studentAvatar: null,
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "dc-3",
    rating: 4,
    comment: "Great pilates session! I felt my core working the entire time. Only wish it was a bit longer.",
    createdAt: daysAgo(7),
  },
  {
    id: "dr-4",
    studentName: "Andrea Conti",
    studentAvatar: null,
    className: "Evening Flow at Villa Borghese",
    classId: "dc-2",
    rating: 5,
    comment: "Brought my partner and we both loved it. The poses were well-explained for beginners but still challenging for me. Highly recommend!",
    createdAt: daysAgo(10),
  },
  {
    id: "dr-5",
    studentName: "Valentina Moretti",
    studentAvatar: null,
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "dc-3",
    rating: 5,
    comment: "Sofia is an incredible instructor. Her attention to form and modifications for different levels is impressive.",
    createdAt: daysAgo(12),
  },
  {
    id: "dr-6",
    studentName: "Chiara Colombo",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    rating: 4,
    comment: "Beautiful location and great class. Would love more advanced options though!",
    createdAt: daysAgo(15),
  },
  {
    id: "dr-7",
    studentName: "Luca Bianchi",
    studentAvatar: null,
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "dc-1",
    rating: 5,
    comment: "Third time attending and it keeps getting better. The morning energy is unmatched.",
    createdAt: daysAgo(20),
  },
  {
    id: "dr-8",
    studentName: "Marco De Luca",
    studentAvatar: null,
    className: "Morning Meditation at Trastevere",
    classId: "dc-5",
    rating: 4,
    comment: "Peaceful meditation session in a lovely part of Trastevere. Great way to start the day.",
    createdAt: daysAgo(22),
  },
];

// ─── Mock students ───────────────────────────────────────────────────

export const MOCK_DASHBOARD_STUDENTS: DashboardStudent[] = [
  {
    id: "ds-1",
    name: "Giulia Marchetti",
    email: "giulia@example.com",
    avatar: null,
    totalBookings: 5,
    totalSpent: 128,
    lastBookingDate: daysAgo(2),
    favoriteClass: "Sunrise Yoga at Parco degli Acquedotti",
  },
  {
    id: "ds-2",
    name: "Luca Bianchi",
    email: "luca.b@example.com",
    avatar: null,
    totalBookings: 4,
    totalSpent: 105.6,
    lastBookingDate: daysAgo(1),
    favoriteClass: "Sunrise Yoga at Parco degli Acquedotti",
  },
  {
    id: "ds-3",
    name: "Elena Ricci",
    email: "elena.r@example.com",
    avatar: null,
    totalBookings: 3,
    totalSpent: 96.8,
    lastBookingDate: daysAgo(3),
    favoriteClass: "Weekend Pilates at Giardino degli Aranci",
  },
  {
    id: "ds-4",
    name: "Alessio Ferrara",
    email: "alessio.f@example.com",
    avatar: null,
    totalBookings: 2,
    totalSpent: 88,
    lastBookingDate: daysAgo(5),
    favoriteClass: "Evening Flow at Villa Borghese",
  },
  {
    id: "ds-5",
    name: "Chiara Colombo",
    email: "chiara.c@example.com",
    avatar: null,
    totalBookings: 2,
    totalSpent: 39.6,
    lastBookingDate: daysAgo(3),
    favoriteClass: "Sunrise Yoga at Parco degli Acquedotti",
  },
  {
    id: "ds-6",
    name: "Valentina Moretti",
    email: "vale.m@example.com",
    avatar: null,
    totalBookings: 1,
    totalSpent: 24.2,
    lastBookingDate: daysAgo(7),
    favoriteClass: "Weekend Pilates at Giardino degli Aranci",
  },
  {
    id: "ds-7",
    name: "Francesco Romano",
    email: "francesco.r@example.com",
    avatar: null,
    totalBookings: 1,
    totalSpent: 0,
    lastBookingDate: daysAgo(2),
    favoriteClass: "Sunrise Yoga at Parco degli Acquedotti",
  },
  {
    id: "ds-8",
    name: "Andrea Conti",
    email: "andrea.c@example.com",
    avatar: null,
    totalBookings: 2,
    totalSpent: 68.2,
    lastBookingDate: daysAgo(10),
    favoriteClass: "Evening Flow at Villa Borghese",
  },
  {
    id: "ds-9",
    name: "Sofia Esposito",
    email: "sofia.e@example.com",
    avatar: null,
    totalBookings: 1,
    totalSpent: 16.5,
    lastBookingDate: daysAgo(1),
    favoriteClass: "Morning Meditation at Trastevere",
  },
  {
    id: "ds-10",
    name: "Marco De Luca",
    email: "marco.dl@example.com",
    avatar: null,
    totalBookings: 2,
    totalSpent: 44,
    lastBookingDate: daysAgo(1),
    favoriteClass: "Sunrise Yoga at Parco degli Acquedotti",
  },
];

// ─── Generate chart data ─────────────────────────────────────────────

function generateDailyRevenue(days: number): DailyRevenue[] {
  const data: DailyRevenue[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const base = 40 + Math.sin(i * 0.3) * 20;
    const jitter = Math.random() * 30 - 15;
    const weekend = new Date(Date.now() - i * 86400000).getDay();
    const weekendBoost = weekend === 0 || weekend === 6 ? 25 : 0;
    data.push({
      date: daysAgo(i),
      revenue: Math.max(0, Math.round((base + jitter + weekendBoost) * 100) / 100),
    });
  }
  return data;
}

function generateDailyBookings(days: number): DailyBookings[] {
  const data: DailyBookings[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const weekend = new Date(Date.now() - i * 86400000).getDay();
    const boost = weekend === 0 || weekend === 6 ? 2 : 0;
    data.push({
      date: daysAgo(i),
      confirmed: Math.floor(Math.random() * 3) + 1 + boost,
      completed: Math.floor(Math.random() * 2) + boost,
      cancelled: Math.random() > 0.7 ? 1 : 0,
    });
  }
  return data;
}

function generateMonthlyEarnings(months: number): MonthlyEarnings[] {
  const data: MonthlyEarnings[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    const base = 800 + (months - i) * 60;
    const jitter = Math.random() * 300 - 150;
    data.push({
      month: monthName,
      earnings: Math.max(200, Math.round(base + jitter)),
    });
  }
  return data;
}

export const MOCK_DAILY_REVENUE_7D = generateDailyRevenue(7);
export const MOCK_DAILY_REVENUE_30D = generateDailyRevenue(30);
export const MOCK_DAILY_REVENUE_90D = generateDailyRevenue(90);
export const MOCK_DAILY_REVENUE_365D = generateDailyRevenue(365);

export const MOCK_DAILY_BOOKINGS_7D = generateDailyBookings(7);
export const MOCK_DAILY_BOOKINGS_30D = generateDailyBookings(30);
export const MOCK_DAILY_BOOKINGS_90D = generateDailyBookings(90);
export const MOCK_DAILY_BOOKINGS_365D = generateDailyBookings(365);

export const MOCK_MONTHLY_EARNINGS = generateMonthlyEarnings(12);

// ─── Next session (within 24h) ───────────────────────────────────────

export const MOCK_NEXT_SESSION = {
  className: "Sunrise Yoga at Parco degli Acquedotti",
  classId: "dc-1",
  startTime: hoursFromNow(3),
  location: "Parco degli Acquedotti, Roma",
  bookedStudents: 8,
  capacity: 12,
};
