import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, MessageCircle, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, formatTime } from '@/lib/format';

export function ClientDashboardPage() {
  const { client, subscription, bookings, messages, announcements, loading } = useClientData();

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  if (!client) {
    return (
      <Card className="p-8 text-center">
        <p className="text-ink-600">Profilul de client nu a fost găsit. Contactează antrenorul pentru a-ți activa contul.</p>
      </Card>
    );
  }

  const now = new Date();
  const upcomingBookings = bookings
    .filter((b) => b.status === 'scheduled' && new Date(b.slot.starts_at) > now)
    .sort((a, b) => new Date(a.slot.starts_at).getTime() - new Date(b.slot.starts_at).getTime());
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const sessionsUsed = completedBookings.filter((b) => b.consumes_session).length;
  const sessionsTotal = subscription?.sessions_per_month ?? 0;
  const sessionsLeft = Math.max(0, sessionsTotal - sessionsUsed);
  const unreadMessages = messages.filter((m) => m.sender === 'coach' && !m.read_at).length;

  const nextBooking = upcomingBookings[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">
          Salut, {client.name.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-ink-500">Iată un rezumat al contului tău.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100">
              <Calendar size={20} className="text-accent-600" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Următoarea ședință</p>
              <p className="font-semibold text-ink-900">
                {nextBooking ? formatDateTime(nextBooking.slot.starts_at) : '—'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-100">
              <CheckCircle2 size={20} className="text-success-600" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Ședințe efectuate</p>
              <p className="font-semibold text-ink-900">{sessionsUsed} / {sessionsTotal}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100">
              <Clock size={20} className="text-ink-600" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Ședințe rămase</p>
              <p className="font-semibold text-ink-900">{sessionsLeft}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100">
              <MessageCircle size={20} className="text-ink-600" />
            </div>
            <div>
              <p className="text-xs text-ink-400">Mesaje noi</p>
              <p className="font-semibold text-ink-900">{unreadMessages}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Next session */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Următoarea ședință</h2>
            <Link to="/portal/calendar" className="text-sm font-medium text-accent-600 hover:text-accent-700">
              Rezervă →
            </Link>
          </div>
          {nextBooking ? (
            <div className="mt-4 rounded-xl2 bg-ink-50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-ink-900">{formatDateTime(nextBooking.slot.starts_at)}</p>
                  <p className="mt-1 text-sm text-ink-500">
                    {formatTime(nextBooking.slot.starts_at)} – {formatTime(nextBooking.slot.ends_at)}
                  </p>
                  {nextBooking.slot.location && (
                    <p className="mt-1 text-sm text-ink-500">📍 {nextBooking.slot.location}</p>
                  )}
                </div>
                <StatusBadge status={nextBooking.status} />
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl2 bg-ink-50 p-8 text-center">
              <p className="text-ink-500">Nu ai nicio ședință programată.</p>
              <Link to="/portal/calendar">
                <Button className="mt-4">Rezervă o ședință</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Subscription progress */}
        <Card className="p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Abonament</h2>
          {subscription ? (
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-4xl text-ink-900">{sessionsLeft}</p>
                  <p className="text-sm text-ink-400">ședințe rămase</p>
                </div>
                <p className="text-sm text-ink-500">din {sessionsTotal}</p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-accent-400 transition-all"
                  style={{ width: `${sessionsTotal > 0 ? (sessionsLeft / sessionsTotal) * 100 : 0}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-ink-400">
                Perioada: {new Date(subscription.period_start).toLocaleDateString('ro-RO')} – {new Date(subscription.period_end).toLocaleDateString('ro-RO')}
              </p>
              {subscription.extension_days > 0 && (
                <p className="mt-1 text-xs text-success-600">+{subscription.extension_days} zile extensie</p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-500">Nu ai abonament activ.</p>
          )}
        </Card>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
            <Bell size={18} className="text-accent-500" />
            Anunțuri
          </h2>
          <div className="mt-4 space-y-3">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="rounded-xl bg-ink-50 p-4">
                <p className="font-semibold text-ink-900">{a.title}</p>
                <p className="mt-1 text-sm text-ink-500">{a.body}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent bookings */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Programări recente</h2>
          <Link to="/portal/programari" className="text-sm font-medium text-accent-600 hover:text-accent-700">
            Vezi toate →
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{formatDateTime(b.slot.starts_at)}</p>
                <p className="text-xs text-ink-400">{b.slot.location}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
          {bookings.length === 0 && <p className="text-sm text-ink-400">Nu ai programări.</p>}
        </div>
      </Card>
    </div>
  );
}
