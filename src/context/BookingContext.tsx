import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { MOCK_BOOKINGS, type BookingData } from "@/data/mockBookings";

interface BookingContextValue {
  bookings: BookingData[];
  addBooking: (booking: BookingData) => void;
  cancelBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingData[]>(MOCK_BOOKINGS);

  const addBooking = useCallback((booking: BookingData) => {
    setBookings((prev) => [booking, ...prev]);
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "cancelled" as const,
              cancelledAt: new Date().toISOString(),
            }
          : b,
      ),
    );
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings(): BookingContextValue {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
}
