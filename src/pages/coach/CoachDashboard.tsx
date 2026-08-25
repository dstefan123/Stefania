import { Routes, Route, Navigate } from 'react-router-dom';
import { CoachLayout } from '@/components/coach/CoachLayout';
import { CoachDashboardPage } from '@/pages/coach/CoachDashboardPage';
import { CoachCalendarPage } from '@/pages/coach/CoachCalendarPage';
import { CoachClientsPage } from '@/pages/coach/CoachClientsPage';
import { CoachBookingsPage } from '@/pages/coach/CoachBookingsPage';
import { CoachSlotsPage } from '@/pages/coach/CoachSlotsPage';
import { CoachSubscriptionsPage } from '@/pages/coach/CoachSubscriptionsPage';
import { CoachMessagesPage } from '@/pages/coach/CoachMessagesPage';
import { CoachAnnouncementsPage } from '@/pages/coach/CoachAnnouncementsPage';
import { CoachReportsPage } from '@/pages/coach/CoachReportsPage';
import { CoachSettingsPage } from '@/pages/coach/CoachSettingsPage';

export function CoachDashboard() {
  return (
    <Routes>
      <Route element={<CoachLayout />}>
        <Route index element={<CoachDashboardPage />} />
        <Route path="calendar" element={<CoachCalendarPage />} />
        <Route path="clienti" element={<CoachClientsPage />} />
        <Route path="programari" element={<CoachBookingsPage />} />
        <Route path="sloturi" element={<CoachSlotsPage />} />
        <Route path="abonamente" element={<CoachSubscriptionsPage />} />
        <Route path="mesaje" element={<CoachMessagesPage />} />
        <Route path="anunturi" element={<CoachAnnouncementsPage />} />
        <Route path="rapoarte" element={<CoachReportsPage />} />
        <Route path="setari" element={<CoachSettingsPage />} />
        <Route path="*" element={<Navigate to="/coach" replace />} />
      </Route>
    </Routes>
  );
}
