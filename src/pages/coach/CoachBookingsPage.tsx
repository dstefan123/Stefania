import { useState, useCallback } from 'react';
import { Clock, MapPin, Check, X, UserX, RotateCcw } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, formatTimeRange } from '@/lib/format';
import type { Booking } from '@/types';

type Tab = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export function CoachBookingsPage() {
  const { bookings, refresh, loading } = useCoachData();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('scheduled');
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = bookings.filter((b) => b.status === tab);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'scheduled', label: 'Programate' },
    { key: 'completed', label: 'Finalizate' },
    { key: 'cancelled', label: 'Anulate' },
    { key: 'no_show', label: 'No-show' },
  ];

  const updateStatus = useCallback(async (bookingId: string, status: Booking['status'], action: string) => {
    setActionLoading(true);
    const update: Record<string, unknown> = { status };
    if (status === 'cancelled') {
      update.cancelled_at = new Date().toISOString();
      update.consumes_session = false;
    }
    if (status === 'completed' || status === 'no_show') {
      update.consumes_session = true;
    }

    await supabase.from('bookings').update(update).eq('id', bookingId);

    if (user) {
      await supabase.from('manual_overrides').insert({
        coach_id: user.id,
        booking_id: bookingId,
        action,
      });
    }

    refresh();
    setActionLoading(false);
  }, [refresh, user]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Programări</h1>
        <p className="mt-1 text-ink-500">Gestionează toate programările.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-ink-950 text-white' : 'bg-white text-ink-600 hover:bg-ink-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-ink-400">Nu sunt programări în această categorie.</p>
          </Card>
        ) : (
          filtered.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-accent-500" />
                    <p className="font-medium text-ink-900">{formatDateTime(b.slot.starts_at)}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{formatTimeRange(b.slot.starts_at, b.slot.ends_at)}</p>
                  {b.slot.location && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                      <MapPin size={14} /> {b.slot.location}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-medium text-ink-700">👤 {b.client?.name}</p>
                  {b.cancellation_reason && (
                    <p className="mt-1 text-xs text-ink-400">Motiv: {b.cancellation_reason}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={b.status} />
                  {b.status === 'scheduled' && (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="dark" className="text-xs" disabled={actionLoading} onClick={() => updateStatus(b.id, 'completed', 'cancel_booking')}>
                        <Check size={14} /> Finalizată
                      </Button>
                      <Button variant="danger" className="text-xs" disabled={actionLoading} onClick={() => updateStatus(b.id, 'no_show', 'mark_no_show')}>
                        <UserX size={14} /> No-show
                      </Button>
                      <Button variant="light" className="text-xs" disabled={actionLoading} onClick={() => updateStatus(b.id, 'cancelled', 'cancel_booking')}>
                        <X size={14} /> Anulează
                      </Button>
                    </div>
                  )}
                  {b.status === 'no_show' && (
                    <Button variant="light" className="text-xs" disabled={actionLoading} onClick={() => updateStatus(b.id, 'scheduled', 'return_session')}>
                      <RotateCcw size={14} /> Returnează
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
