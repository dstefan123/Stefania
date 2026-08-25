import { useClientData } from '@/hooks/useClientData';
import { Card } from '@/components/ui/Card';
import { SubscriptionStatusBadge } from '@/components/ui/Badge';
import { TrendingUp, Calendar, Clock, Plus } from 'lucide-react';

export function ClientSubscriptionPage() {
  const { subscription, bookings, loading } = useClientData();

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  if (!subscription) {
    return (
      <Card className="p-8 text-center">
        <p className="text-ink-500">Nu ai abonament activ. Contactează antrenorul.</p>
      </Card>
    );
  }

  const completed = bookings.filter((b) => b.status === 'completed' && b.consumes_session).length;
  const total = subscription.sessions_per_month;
  const left = Math.max(0, total - completed);
  const percent = total > 0 ? (left / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Abonamentul meu</h1>
        <p className="mt-1 text-ink-500">Progresul ședințelor tale în perioada curentă.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-ink-950 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-400">Abonament</p>
              <p className="font-display text-4xl uppercase text-white">{total} ședințe</p>
            </div>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-ink-300">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {new Date(subscription.period_start).toLocaleDateString('ro-RO')}
            </span>
            <span>→</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {new Date(subscription.period_end).toLocaleDateString('ro-RO')}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-2 flex items-end justify-between">
            <p className="text-sm font-medium text-ink-600">Progres ședințe</p>
            <p className="text-sm text-ink-400">{completed} din {total}</p>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl2 bg-success-50 p-4 text-center">
              <CheckCircleIcon />
              <p className="mt-2 font-display text-2xl text-ink-900">{completed}</p>
              <p className="text-xs text-ink-500">Efectuate</p>
            </div>
            <div className="rounded-xl2 bg-accent-50 p-4 text-center">
              <Clock size={24} className="mx-auto text-accent-500" />
              <p className="mt-2 font-display text-2xl text-ink-900">{left}</p>
              <p className="text-xs text-ink-500">Rămase</p>
            </div>
            <div className="rounded-xl2 bg-ink-100 p-4 text-center">
              <TrendingUp size={24} className="mx-auto text-ink-500" />
              <p className="mt-2 font-display text-2xl text-ink-900">{Math.round(percent)}%</p>
              <p className="text-xs text-ink-500">Disponibil</p>
            </div>
          </div>

          {subscription.extension_days > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3">
              <Plus size={16} className="text-success-600" />
              <p className="text-sm text-success-700">
                Abonament prelungit cu {subscription.extension_days} zile
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto text-success-500">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
