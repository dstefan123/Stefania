import { useState, useCallback } from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, formatTimeRange, isMoreThan24HoursAway } from '@/lib/format';
import type { Booking } from '@/types';

type Tab = 'upcoming' | 'completed' | 'cancelled' | 'no_show';

export function ClientBookingsPage() {
  const { bookings, refresh, loading } = useClientData();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [cancelTarget, setCancelTarget] = useState<(Booking & { slot: { starts_at: string; ends_at: string; location: string | null } }) | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();

  const filtered = useCallback(() => {
    switch (tab) {
      case 'upcoming':
        return bookings.filter((b) => b.status === 'scheduled' && new Date(b.slot.starts_at) > now);
      case 'completed':
        return bookings.filter((b) => b.status === 'completed');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      case 'no_show':
        return bookings.filter((b) => b.status === 'no_show');
    }
  }, [bookings, tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: 'Viitoare' },
    { key: 'completed', label: 'Finalizate' },
    { key: 'cancelled', label: 'Anulate' },
    { key: 'no_show', label: 'No-show' },
  ];

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setError(null);

    if (!isMoreThan24HoursAway(cancelTarget.slot.starts_at)) {
      setError('Programarea nu mai poate fi anulată deoarece sunt mai puțin de 24 de ore până la ședință.');
      setCancelling(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), cancellation_reason: 'Anulat de client' })
      .eq('id', cancelTarget.id);

    if (updateError) {
      setError('Nu am putut anula programarea. Încearcă din nou.');
    } else {
      setCancelTarget(null);
      refresh();
    }
    setCancelling(false);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Programările mele</h1>
        <p className="mt-1 text-ink-500">Vezi și gestionează toate programările tale.</p>
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
        {filtered().length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-ink-400">Nu ai programări în această categorie.</p>
          </Card>
        ) : (
          filtered().map((b) => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
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
                  {b.cancellation_reason && (
                    <p className="mt-2 text-xs text-ink-400">Motiv: {b.cancellation_reason}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={b.status} />
                  {b.status === 'scheduled' && isMoreThan24HoursAway(b.slot.starts_at) && (
                    <Button variant="danger" className="text-xs" onClick={() => setCancelTarget(b)}>
                      Anulează
                    </Button>
                  )}
                  {b.status === 'scheduled' && !isMoreThan24HoursAway(b.slot.starts_at) && (
                    <span className="flex items-center gap-1 text-xs text-ink-400">
                      <AlertCircle size={12} /> Anulare blocată
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal open={!!cancelTarget} onClose={() => { setCancelTarget(null); setError(null); }} title="Anulează programarea">
        {cancelTarget && (
          <div className="space-y-4">
            {error && <div className="rounded-xl bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}
            <p className="text-sm text-ink-600">
              Sigur vrei să anulezi programarea din <strong>{formatDateTime(cancelTarget.slot.starts_at)}</strong>?
            </p>
            <div className="flex gap-3">
              <Button variant="light" className="flex-1" onClick={() => setCancelTarget(null)}>Nu, păstrează</Button>
              <Button variant="danger" className="flex-1" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Se anulează...' : 'Da, anulează'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
