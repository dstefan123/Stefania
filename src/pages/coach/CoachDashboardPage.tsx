import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, AlertCircle, MessageCircle, CreditCard, TrendingUp, ArrowRight, XCircle, UserX } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, formatTime, getWeekStart, addDays, isSameDay } from '@/lib/format';

export function CoachDashboardPage() {
  const { clients, bookings, slots, messages, subscriptions, loading } = useCoachData();

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  const now = new Date();
  const today = new Date();
  const weekStart = getWeekStart();
  const weekEnd = addDays(weekStart, 7);

  const todayBookings = bookings.filter((b) => isSameDay(new Date(b.slot.starts_at), today));
  const todaySlots = slots.filter((s) => isSameDay(new Date(s.starts_at), today));
  const freeSlotsToday = todaySlots.filter((s) => !bookings.some((b) => b.slot_id === s.id && b.status === 'scheduled'));
  const cancellationsToday = bookings.filter((b) => b.status === 'cancelled' && b.cancelled_at && isSameDay(new Date(b.cancelled_at), today));
  const noShowsToday = bookings.filter((b) => b.status === 'no_show' && isSameDay(new Date(b.slot.starts_at), today));

  const weekBookings = bookings.filter((b) => {
    const d = new Date(b.slot.starts_at);
    return d >= weekStart && d < weekEnd && b.status === 'scheduled';
  });
  const weekFreeSlots = slots.filter((s) => {
    const d = new Date(s.starts_at);
    return d >= weekStart && d < weekEnd && !bookings.some((b) => b.slot_id === s.id && b.status === 'scheduled');
  });
  const weekClients = new Set(weekBookings.map((b) => b.client_id)).size;

  const unreadMessages = messages.filter((m) => m.sender === 'client' && !m.read_at);
  const lowSubscriptions = subscriptions.filter((s) => {
    const used = bookings.filter((b) => b.client_id === s.client_id && b.consumes_session && b.status === 'completed').length;
    return s.status === 'active' && used >= s.sessions_per_month - 2;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Dashboard</h1>
        <p className="mt-1 text-ink-500">Privire de ansamblu asupra activității.</p>
      </div>

      {/* Today section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
            <Calendar size={18} className="text-accent-500" /> Astăzi
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatBox label="Programări" value={todayBookings.filter((b) => b.status === 'scheduled').length} icon={Calendar} color="accent" />
            <StatBox label="Sloturi libere" value={freeSlotsToday.length} icon={Clock} color="neutral" />
            <StatBox label="Anulări" value={cancellationsToday.length} icon={XCircle} color="danger" />
            <StatBox label="No-show" value={noShowsToday.length} icon={UserX} color="danger" />
          </div>
          <div className="mt-4 space-y-2">
            {todayBookings.filter((b) => b.status === 'scheduled').slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{formatTime(b.slot.starts_at)} — {b.client?.name}</p>
                  <p className="text-xs text-ink-400">{b.slot.location}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
            {todayBookings.filter((b) => b.status === 'scheduled').length === 0 && (
              <p className="py-4 text-center text-sm text-ink-400">Nu ai programări astăzi.</p>
            )}
          </div>
        </Card>

        {/* This week */}
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
            <TrendingUp size={18} className="text-accent-500" /> Săptămâna aceasta
          </h2>
          <div className="mt-4 space-y-3">
            <StatRow label="Ședințe" value={weekBookings.length} />
            <StatRow label="Sloturi libere" value={weekFreeSlots.length} />
            <StatRow label="Clienți programați" value={weekClients} />
            <StatRow label="Total clienți" value={clients.length} />
          </div>
        </Card>
      </div>

      {/* To resolve */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
          <AlertCircle size={18} className="text-warning-500" /> De rezolvat
        </h2>
        <div className="mt-4 space-y-2">
          {unreadMessages.length > 0 && (
            <Link to="/coach/mesaje" className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 transition-colors hover:bg-ink-100">
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-accent-500" />
                <span className="text-sm font-medium text-ink-900">{unreadMessages.length} mesaje necitite</span>
              </div>
              <ArrowRight size={16} className="text-ink-400" />
            </Link>
          )}
          {lowSubscriptions.length > 0 && (
            <Link to="/coach/abonamente" className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 transition-colors hover:bg-ink-100">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-warning-500" />
                <span className="text-sm font-medium text-ink-900">{lowSubscriptions.length} abonamente aproape terminate</span>
              </div>
              <ArrowRight size={16} className="text-ink-400" />
            </Link>
          )}
          {unreadMessages.length === 0 && lowSubscriptions.length === 0 && (
            <p className="py-4 text-center text-sm text-ink-400">Totul este rezolvat.</p>
          )}
        </div>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink to="/coach/calendar" icon={Calendar} label="Calendar" />
        <QuickLink to="/coach/clienti" icon={Users} label="Clienți" />
        <QuickLink to="/coach/sloturi" icon={Clock} label="Sloturi" />
        <QuickLink to="/coach/anunturi" icon={MessageCircle} label="Anunțuri" />
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Calendar; color: string }) {
  const colors: Record<string, string> = {
    accent: 'bg-accent-100 text-accent-600',
    neutral: 'bg-ink-100 text-ink-600',
    danger: 'bg-danger-100 text-danger-600',
  };
  return (
    <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="font-display text-xl text-ink-900">{value}</p>
        <p className="text-xs text-ink-400">{label}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-2.5">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="font-display text-lg text-ink-900">{value}</span>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: typeof Calendar; label: string }) {
  return (
    <Link to={to} className="card group flex items-center gap-3 p-4 transition-all hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 transition-colors group-hover:bg-accent-400">
        <Icon size={20} className="text-accent-400 group-hover:text-ink-950" />
      </div>
      <span className="text-sm font-medium text-ink-900">{label}</span>
      <ArrowRight size={16} className="ml-auto text-ink-300 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
