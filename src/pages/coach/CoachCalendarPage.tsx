import { useState, useCallback } from 'react';
import { Clock, MapPin, Plus, Trash2, User, Check, X, UserX } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/Badge';
import { formatTime, formatTimeRange, getWeekStart, addDays, isSameDay, getWeekdayName, getDayLabel } from '@/lib/format';
import type { AvailabilitySlot, Booking, Client } from '@/types';

export function CoachCalendarPage() {
  const { clients, bookings, slots, refresh } = useCoachData();
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getBookingForSlot = (slotId: string) => bookings.find((b) => b.slot_id === slotId && b.status === 'scheduled');

  const handleStatusChange = useCallback(async (bookingId: string, status: Booking['status']) => {
    setActionLoading(true);
    setError(null);
    const update: Record<string, unknown> = { status };
    if (status === 'cancelled') {
      update.cancelled_at = new Date().toISOString();
      update.consumes_session = false;
    }
    if (status === 'no_show') {
      update.consumes_session = true;
    }

    const { error: updateError } = await supabase.from('bookings').update(update).eq('id', bookingId);
    if (updateError) {
      setError('Nu am putut actualiza programarea.');
    } else {
      if (user) {
        await supabase.from('manual_overrides').insert({
          coach_id: user.id,
          booking_id: bookingId,
          action: status === 'no_show' ? 'mark_no_show' : 'cancel_booking',
        });
      }
      refresh();
      setSelectedSlot(null);
    }
    setActionLoading(false);
  }, [refresh, user]);

  const handleDeleteSlot = async (slotId: string) => {
    setActionLoading(true);
    const { error: deleteError } = await supabase.from('availability_slots').delete().eq('id', slotId);
    if (deleteError) {
      setError('Nu am putut șterge slotul.');
    } else {
      refresh();
      setSelectedSlot(null);
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Calendar</h1>
          <p className="mt-1 text-ink-500">Gestionează sloturi și programări.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="light" onClick={() => setWeekStart(addDays(weekStart, -7))}>←</Button>
          <Button variant="light" onClick={() => setWeekStart(getWeekStart())}>Astăzi</Button>
          <Button variant="light" onClick={() => setWeekStart(addDays(weekStart, 7))}>→</Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Slot
          </Button>
        </div>
      </div>

      {error && <div className="rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-700">{error}</div>}

      <div className="grid gap-3 lg:grid-cols-7">
        {weekDays.map((day) => {
          const daySlots = slots.filter((s) => isSameDay(new Date(s.starts_at), day));
          return (
            <div key={day.toISOString()} className="min-h-[200px]">
              <div className="mb-2 rounded-xl bg-ink-950 px-3 py-2 text-center text-white">
                <p className="text-xs font-semibold uppercase text-ink-300">{getWeekdayName(day)}</p>
                <p className="text-sm font-medium">{getDayLabel(day)}</p>
              </div>
              <div className="space-y-2">
                {daySlots.map((slot) => {
                  const booking = getBookingForSlot(slot.id);
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full rounded-xl border p-3 text-left transition-all hover:shadow-sm ${
                        booking
                          ? 'border-accent-300 bg-accent-50'
                          : slot.published
                          ? 'border-ink-100 bg-white'
                          : 'border-dashed border-ink-200 bg-ink-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
                        <Clock size={14} className="text-accent-500" />
                        {formatTime(slot.starts_at)}
                      </div>
                      {booking ? (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-ink-700">
                          <User size={12} /> {booking.client?.name}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-ink-400">
                          {slot.published ? 'Liber' : 'Nepublicat'}
                        </p>
                      )}
                      {slot.location && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                          <MapPin size={10} /> {slot.location}
                        </p>
                      )}
                    </button>
                  );
                })}
                {daySlots.length === 0 && (
                  <p className="py-4 text-center text-xs text-ink-300">—</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slot detail modal */}
      <Modal open={!!selectedSlot} onClose={() => { setSelectedSlot(null); setError(null); }} title="Detalii slot">
        {selectedSlot && (() => {
          const booking = getBookingForSlot(selectedSlot.id);
          return (
            <div className="space-y-4">
              <div className="rounded-xl2 bg-ink-50 p-4">
                <p className="font-medium text-ink-900">
                  {new Date(selectedSlot.starts_at).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-ink-500">
                  <Clock size={16} /> {formatTimeRange(selectedSlot.starts_at, selectedSlot.ends_at)}
                </p>
                {selectedSlot.location && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink-500">
                    <MapPin size={16} /> {selectedSlot.location}
                  </p>
                )}
                <p className="mt-2">
                  <span className={`badge ${selectedSlot.published ? 'badge-success' : 'badge-neutral'}`}>
                    {selectedSlot.published ? 'Publicat' : 'Nepublicat'}
                  </span>
                </p>
              </div>

              {booking && (
                <div className="rounded-xl2 border border-accent-200 bg-accent-50 p-4">
                  <p className="text-sm font-medium text-ink-900">Programare: {booking.client?.name}</p>
                  <p className="text-xs text-ink-500">{booking.client?.email} · {booking.client?.phone}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="dark" className="text-xs" disabled={actionLoading} onClick={() => handleStatusChange(booking.id, 'completed')}>
                      <Check size={14} /> Finalizată
                    </Button>
                    <Button variant="danger" className="text-xs" disabled={actionLoading} onClick={() => handleStatusChange(booking.id, 'no_show')}>
                      <UserX size={14} /> No-show
                    </Button>
                    <Button variant="light" className="text-xs" disabled={actionLoading} onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                      <X size={14} /> Anulează
                    </Button>
                  </div>
                </div>
              )}

              <Button variant="danger" className="w-full" disabled={actionLoading} onClick={() => handleDeleteSlot(selectedSlot.id)}>
                <Trash2 size={16} /> Șterge slot
              </Button>
            </div>
          );
        })()}
      </Modal>

      <CreateSlotModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={refresh} />
    </div>
  );
}

function CreateSlotModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [location, setLocation] = useState('Studio 1');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    const startsAt = new Date(`${date}T${startTime}:00`);
    const endsAt = new Date(`${date}T${endTime}:00`);

    if (endsAt <= startsAt) {
      setError('Ora de sfârșit trebuie să fie după ora de început.');
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from('availability_slots').insert({
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      location,
      published,
      bookable_from: published ? new Date().toISOString() : null,
    });

    if (insertError) {
      setError('Nu am putut crea slotul.');
    } else {
      onCreated();
      onClose();
      setDate('');
    }
    setSaving(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Creează slot nou">
      <div className="space-y-4">
        {error && <div className="rounded-xl bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}
        <div>
          <label className="label">Data</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Început</label>
            <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="label">Sfârșit</label>
            <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Locație</label>
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-ink-300" />
          <span className="text-sm text-ink-700">Publicat (vizibil clienților)</span>
        </label>
        <Button onClick={handleCreate} disabled={saving || !date} className="w-full">
          {saving ? 'Se creează...' : 'Creează slot'}
        </Button>
      </div>
    </Modal>
  );
}
