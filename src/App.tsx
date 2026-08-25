import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicLayout } from '@/components/public/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { ResultsPage } from '@/pages/public/ResultsPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LoginPage } from '@/pages/public/LoginPage';
import { SignupPage } from '@/pages/public/SignupPage';
import { ClientPortal } from '@/pages/portal/ClientPortal';
import { CoachDashboard } from '@/pages/coach/CoachDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/despre" element={<AboutPage />} />
                  <Route path="/servicii" element={<ServicesPage />} />
                  <Route path="/rezultate" element={<ResultsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </PublicLayout>
            }
          />

          <Route
            path="/portal/*"
            element={
              <ProtectedRoute role="client">
                <ClientPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coach/*"
            element={
              <ProtectedRoute role="coach">
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
