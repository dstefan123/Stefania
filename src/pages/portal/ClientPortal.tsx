import { Routes, Route, Navigate } from 'react-router-dom';
import { ClientLayout } from '@/components/portal/ClientLayout';
import { ClientDashboardPage } from '@/pages/portal/ClientDashboardPage';
import { ClientCalendarPage } from '@/pages/portal/ClientCalendarPage';
import { ClientBookingsPage } from '@/pages/portal/ClientBookingsPage';
import { ClientSubscriptionPage } from '@/pages/portal/ClientSubscriptionPage';
import { ClientMessagesPage } from '@/pages/portal/ClientMessagesPage';
import { ClientProfilePage } from '@/pages/portal/ClientProfilePage';

export function ClientPortal() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<ClientDashboardPage />} />
        <Route path="calendar" element={<ClientCalendarPage />} />
        <Route path="programari" element={<ClientBookingsPage />} />
        <Route path="abonament" element={<ClientSubscriptionPage />} />
        <Route path="mesaje" element={<ClientMessagesPage />} />
        <Route path="profil" element={<ClientProfilePage />} />
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Route>
    </Routes>
  );
}
