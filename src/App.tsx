import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { ClassesPage } from "@/pages/ClassesPage";
import { ClassDetailPage } from "@/pages/ClassDetailPage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { InstructorsPage } from "@/pages/InstructorsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { InstructorProfilePage } from "@/pages/InstructorProfilePage";

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
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="classes/:id" element={<ClassDetailPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="instructors" element={<InstructorsPage />} />
              <Route path="instructors/:id" element={<InstructorProfilePage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
