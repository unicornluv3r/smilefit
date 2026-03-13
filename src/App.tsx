import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HomePage } from "@/pages/HomePage";
import { ClassesPage } from "@/pages/ClassesPage";
import { ClassDetailPage } from "@/pages/ClassDetailPage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { InstructorsPage } from "@/pages/InstructorsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { BookingsPage } from "@/pages/BookingsPage";
import { InstructorProfilePage } from "@/pages/InstructorProfilePage";
import { CreateClassPage } from "@/pages/CreateClassPage";
import { BecomeInstructorPage } from "@/pages/BecomeInstructorPage";
import { InstructorRoute } from "@/components/InstructorRoute";
import { CitiesPage } from "@/pages/CitiesPage";
import { CityPage } from "@/pages/CityPage";
import { BookingSuccessPage } from "@/pages/BookingSuccessPage";
import { BookingCancelledPage } from "@/pages/BookingCancelledPage";
import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { DashboardLayout } from "@/pages/instructor/DashboardLayout";
import { OverviewPage } from "@/pages/instructor/OverviewPage";
import { ClassesManagePage } from "@/pages/instructor/ClassesManagePage";
import { BookingsManagePage } from "@/pages/instructor/BookingsManagePage";
import { StudentsPage } from "@/pages/instructor/StudentsPage";
import { EarningsPage } from "@/pages/instructor/EarningsPage";
import { ReviewsPage } from "@/pages/instructor/ReviewsPage";
import { SettingsPage } from "@/pages/instructor/SettingsPage";

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
              <Route path="become-instructor" element={<BecomeInstructorPage />} />
              <Route path="booking/success" element={<BookingSuccessPage />} />
              <Route path="booking/cancelled" element={<BookingCancelledPage />} />
              <Route
                path="instructor/dashboard"
                element={
                  <InstructorRoute>
                    <DashboardLayout />
                  </InstructorRoute>
                }
              >
                <Route index element={<OverviewPage />} />
                <Route path="classes" element={<ClassesManagePage />} />
                <Route path="bookings" element={<BookingsManagePage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="earnings" element={<EarningsPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route
                path="instructor/classes/new"
                element={
                  <InstructorRoute>
                    <CreateClassPage />
                  </InstructorRoute>
                }
              />
              <Route
                path="instructor/classes/:id/edit"
                element={
                  <InstructorRoute>
                    <CreateClassPage />
                  </InstructorRoute>
                }
              />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="auth/callback" element={<AuthCallbackPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="register" element={<Navigate to="/signup" replace />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="bookings"
                element={
                  <ProtectedRoute>
                    <BookingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
