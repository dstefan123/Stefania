import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatTime, formatTimeRange, getWeekStart, addDays, isSameDay, getWeekdayName, getDayLabel } from '@/lib/format';
import type { AvailabilitySlot, Booking } from '@/types';

export function ClientCalendarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [bookedSlotIds, setBookedSlotIds] = useState<Set<string>>(new Set());
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (clientData) {
      setClientId(clientData.id);
      const { data: userBookings } = await supabase
        .from('bookings')
        .select('slot_id')
        .eq('client_id', clientData.id)
        .in('status', ['scheduled']);
      setBookedSlotIds(new Set((userBookings ?? []).map((b: { slot_id: string }) => b.slot_id)));
    }

    const { data: slotData } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('published', true)
      .order('starts_at', { ascending: true });

    setSlots((slotData ?? []) as AvailabilitySlot[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const slotsByDay = weekDays.map((day) => ({
    day,
    slots: slots.filter((s) => isSameDay(new Date(s.starts_at), day) && !bookedSlotIds.has(s.id)),
  }));

  const handleBook = async () => {
    if (!selectedSlot || !clientId) return;
    setBooking(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('bookings')
      .insert({
        slot_id: selectedSlot.id,
        client_id: clientId,
        status: 'scheduled',
        consumes_session: true,
      });

    if (insertError) {
      setError('Nu am putut rezerva slotul. Poate a fost deja rezervat.');
      setBooking(false);
      return;
    }

    setBookedSlotIds((prev) => new Set([...prev, selectedSlot.id]));
    setSuccess(true);
    setBooking(false);
    setTimeout(() => {
      setSuccess(false);
      setSelectedSlot(null);
      navigate('/portal/programari');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Calendar</h1>
          <p className="mt-1 text-ink-500">Rezervă un slot disponibil.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="light" onClick={() => setWeekStart(addDays(weekStart, -7))}>←</Button>
          <Button variant="light" onClick={() => setWeekStart(getWeekStart())}>Astăzi</Button>
          <Button variant="light" onClick={() => setWeekStart(addDays(weekStart, 7))}>→</Button>
        </div>
      </div>

      <p className="text-sm text-ink-500">
        {weekStart.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })} – {addDays(weekStart, 6).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}
      </p>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {slotsByDay.map(({ day, slots: daySlots }) => (
            <div key={day.toISOString()} className="min-h-[120px]">
              <div className="mb-2 text-center">
                <p className="text-xs font-semibold uppercase text-ink-400">{getWeekdayName(day)}</p>
                <p className="text-sm font-medium text-ink-900">{getDayLabel(day)}</p>
              </div>
              <div className="space-y-2">
                {daySlots.length === 0 ? (
                  <p className="py-4 text-center text-xs text-ink-300">—</p>
                ) : (
                  daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className="w-full rounded-xl border border-ink-100 bg-white p-3 text-left transition-all hover:border-accent-300 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
                        <Clock size={14} className="text-accent-500" />
                        {formatTime(slot.starts_at)}
                      </div>
                      {slot.location && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                          <MapPin size={10} /> {slot.location}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selectedSlot} onClose={() => setSelectedSlot(null)} title="Confirmă rezervarea">
        {selectedSlot && (
          <div className="space-y-4">
            {error && <div className="rounded-xl bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}
            {success ? (
              <div className="rounded-xl bg-success-50 p-6 text-center">
                <Check size={32} className="mx-auto mb-2 text-success-500" />
                <p className="font-medium text-success-700">Rezervare confirmată!</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl2 bg-ink-50 p-4">
                  <div className="flex items-center gap-2 text-ink-900">
                    <Calendar size={18} className="text-accent-500" />
                    <span className="font-medium">
                      {new Date(selectedSlot.starts_at).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-500">
                    <Clock size={16} /> {formatTimeRange(selectedSlot.starts_at, selectedSlot.ends_at)}
                  </p>
                  {selectedSlot.location && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-ink-500">
                      <MapPin size={16} /> {selectedSlot.location}
                    </p>
                  )}
                </div>
                <Button onClick={handleBook} disabled={booking} className="w-full">
                  {booking ? 'Se rezervă...' : 'Confirmă rezervarea'}
                </Button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
