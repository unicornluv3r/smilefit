import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { ClassesPage } from "@/pages/ClassesPage";
import { ClassDetailPage } from "@/pages/ClassDetailPage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { InstructorsPage } from "@/pages/InstructorsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { InstructorProfilePage } from "@/pages/InstructorProfilePage";
import { CitiesPage } from "@/pages/CitiesPage";
import { CityPage } from "@/pages/CityPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="classes/:id" element={<ClassDetailPage />} />
              <Route path="cities" element={<CitiesPage />} />
              <Route path="cities/:slug" element={<CityPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="instructors" element={<InstructorsPage />} />
              <Route path="instructors/:id" element={<InstructorProfilePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="register" element={<Navigate to="/signup" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
