import { useCoachData } from '@/hooks/useCoachData';
import { Card } from '@/components/ui/Card';
import { Users, Calendar, TrendingUp, AlertCircle, UserX, CheckCircle2 } from 'lucide-react';

export function CoachReportsPage() {
  const { clients, bookings, subscriptions, overrides, loading } = useCoachData();

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthBookings = bookings.filter((b) => new Date(b.slot.starts_at) >= monthStart);
  const completed = monthBookings.filter((b) => b.status === 'completed');
  const cancelled = monthBookings.filter((b) => b.status === 'cancelled');
  const noShows = monthBookings.filter((b) => b.status === 'no_show');
  const scheduled = monthBookings.filter((b) => b.status === 'scheduled');

  const activeClients = clients.filter((c) => c.status === 'active').length;
  const pausedClients = clients.filter((c) => c.status === 'paused').length;
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;

  const completionRate = monthBookings.length > 0
    ? Math.round((completed.length / monthBookings.length) * 100)
    : 0;
  const cancelRate = monthBookings.length > 0
    ? Math.round((cancelled.length / monthBookings.length) * 100)
    : 0;
  const noShowRate = monthBookings.length > 0
    ? Math.round((noShows.length / monthBookings.length) * 100)
    : 0;

  const stats = [
    { label: 'Clienți activi', value: activeClients, icon: Users, color: 'accent' },
    { label: 'Abonamente active', value: activeSubs, icon: CheckCircle2, color: 'success' },
    { label: 'Ședințe completate', value: completed.length, icon: Calendar, color: 'neutral' },
    { label: 'Override-uri', value: overrides.length, icon: AlertCircle, color: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Rapoarte</h1>
        <p className="mt-1 text-ink-500">Statistici pentru luna curentă.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${s.color}-100`}>
                <s.icon size={20} className={`text-${s.color}-600`} />
              </div>
              <div>
                <p className="font-display text-2xl text-ink-900">{s.value}</p>
                <p className="text-xs text-ink-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
            <TrendingUp size={18} className="text-accent-500" /> Rata de finalizare
          </h2>
          <div className="mt-4 space-y-4">
            <RateBar label="Finalizate" value={completionRate} count={completed.length} color="bg-success-500" />
            <RateBar label="Anulate" value={cancelRate} count={cancelled.length} color="bg-danger-500" />
            <RateBar label="No-show" value={noShowRate} count={noShows.length} color="bg-warning-500" />
            <RateBar label="Programate" value={100 - completionRate - cancelRate - noShowRate} count={scheduled.length} color="bg-accent-400" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
            <Users size={18} className="text-accent-500" /> Status clienți
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-success-50 px-4 py-3">
              <span className="text-sm text-ink-600">Activi</span>
              <span className="font-display text-xl text-ink-900">{activeClients}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-warning-50 px-4 py-3">
              <span className="text-sm text-ink-600">Suspendați</span>
              <span className="font-display text-xl text-ink-900">{pausedClients}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-ink-100 px-4 py-3">
              <span className="text-sm text-ink-600">Total</span>
              <span className="font-display text-xl text-ink-900">{clients.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {overrides.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink-900">
            <AlertCircle size={18} className="text-warning-500" /> Override-uri recente
          </h2>
          <div className="mt-4 space-y-2">
            {overrides.slice(0, 10).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{o.action.replace(/_/g, ' ')}</p>
                  {o.reason && <p className="text-xs text-ink-400">{o.reason}</p>}
                </div>
                <p className="text-xs text-ink-400">
                  {new Date(o.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function RateBar({ label, value, count, color }: { label: string; value: number; count: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-ink-600">{label}</span>
        <span className="font-medium text-ink-900">{count} ({value}%)</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink-100">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.max(0, value)}%` }} />
      </div>
    </div>
  );
}
