export interface BookingData {
  id: string;
  className: string;
  classId: string;
  classImage: string;
  instructorName: string;
  instructorAvatar: string;
  category: string;
  city: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  quantity: number;
  pricePerPerson: number;
  totalPrice: number;
  currency: string;
  status: "confirmed" | "completed" | "cancelled";
  bookedAt: string;
  cancelledAt?: string;
  confirmationCode: string;
}

export const MOCK_BOOKINGS: BookingData[] = [
  {
    id: "bk-1",
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "1",
    classImage:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    instructorName: "Sofia Bianchi",
    instructorAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    category: "Yoga",
    city: "Roma",
    location: "Parco degli Acquedotti",
    date: "2026-03-17",
    time: "06:30",
    duration: 75,
    quantity: 2,
    pricePerPerson: 18,
    totalPrice: 39.6,
    currency: "EUR",
    status: "confirmed",
    bookedAt: "2026-03-05T10:23:00",
    confirmationCode: "SF-2026-A7K3M2",
  },
  {
    id: "bk-2",
    className: "Evening Flow at Villa Borghese",
    classId: "10",
    classImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    instructorName: "Sofia Bianchi",
    instructorAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    category: "Yoga",
    city: "Roma",
    location: "Villa Borghese",
    date: "2026-03-22",
    time: "18:00",
    duration: 60,
    quantity: 1,
    pricePerPerson: 20,
    totalPrice: 22,
    currency: "EUR",
    status: "confirmed",
    bookedAt: "2026-03-10T14:05:00",
    confirmationCode: "SF-2026-P9X1B4",
  },
  {
    id: "bk-3",
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "11",
    classImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    instructorName: "Sofia Bianchi",
    instructorAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    category: "Pilates",
    city: "Roma",
    location: "Giardino degli Aranci",
    date: "2026-03-12",
    time: "09:00",
    duration: 60,
    quantity: 1,
    pricePerPerson: 22,
    totalPrice: 24.2,
    currency: "EUR",
    status: "confirmed",
    bookedAt: "2026-03-08T08:15:00",
    confirmationCode: "SF-2026-T4W8N6",
  },
  {
    id: "bk-4",
    className: "Sunrise Yoga at Parco degli Acquedotti",
    classId: "1",
    classImage:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    instructorName: "Sofia Bianchi",
    instructorAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    category: "Yoga",
    city: "Roma",
    location: "Parco degli Acquedotti",
    date: "2026-02-25",
    time: "06:30",
    duration: 75,
    quantity: 1,
    pricePerPerson: 18,
    totalPrice: 19.8,
    currency: "EUR",
    status: "completed",
    bookedAt: "2026-02-18T16:40:00",
    confirmationCode: "SF-2026-L2R5J8",
  },
  {
    id: "bk-5",
    className: "Evening Flow at Villa Borghese",
    classId: "10",
    classImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    instructorName: "Sofia Bianchi",
    instructorAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    category: "Yoga",
    city: "Roma",
    location: "Villa Borghese",
    date: "2026-02-15",
    time: "18:00",
    duration: 60,
    quantity: 3,
    pricePerPerson: 20,
    totalPrice: 66,
    currency: "EUR",
    status: "completed",
    bookedAt: "2026-02-10T09:30:00",
    confirmationCode: "SF-2026-D8F3Q1",
  },
  {
    id: "bk-6",
    className: "Weekend Pilates at Giardino degli Aranci",
    classId: "11",
    classImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    instructorName: "Sofia Bianchi",
    instructorAvatar:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop&crop=face",
    category: "Pilates",
    city: "Roma",
    location: "Giardino degli Aranci",
    date: "2026-03-01",
    time: "09:00",
    duration: 60,
    quantity: 2,
    pricePerPerson: 22,
    totalPrice: 48.4,
    currency: "EUR",
    status: "cancelled",
    bookedAt: "2026-02-20T11:00:00",
    cancelledAt: "2026-02-27T15:30:00",
    confirmationCode: "SF-2026-H6V9C5",
  },
];
