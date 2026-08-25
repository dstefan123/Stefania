import { useState } from 'react';
import { Clock, MapPin, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatTime, formatTimeRange, getWeekStart, addDays, isSameDay, getWeekdayName, getDayLabel } from '@/lib/format';
import type { AvailabilitySlot } from '@/types';

export function CoachSlotsPage() {
  const { slots, bookings, refresh } = useCoachData();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [showCreate, setShowCreate] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const isSlotBooked = (slotId: string) => bookings.some((b) => b.slot_id === slotId && b.status === 'scheduled');

  const togglePublish = async (slot: AvailabilitySlot) => {
    setActionLoading(true);
    await supabase
      .from('availability_slots')
      .update({ published: !slot.published, bookable_from: !slot.published ? new Date().toISOString() : null })
      .eq('id', slot.id);
    refresh();
    setActionLoading(false);
  };

  const deleteSlot = async (slotId: string) => {
    setActionLoading(true);
    await supabase.from('availability_slots').delete().eq('id', slotId);
    refresh();
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Sloturi</h1>
          <p className="mt-1 text-ink-500">Creează și gestionează sloturile de disponibilitate.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="light" onClick={() => setWeekStart(addDays(weekStart, -7))}>←</Button>
          <Button variant="light" onClick={() => setWeekStart(getWeekStart())}>Astăzi</Button>
          <Button variant="light" onClick={() => setWeekStart(addDays(weekStart, 7))}>→</Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Slot nou
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-7">
        {weekDays.map((day) => {
          const daySlots = slots.filter((s) => isSameDay(new Date(s.starts_at), day));
          return (
            <div key={day.toISOString()} className="min-h-[150px]">
              <div className="mb-2 rounded-xl bg-ink-950 px-3 py-2 text-center text-white">
                <p className="text-xs font-semibold uppercase text-ink-300">{getWeekdayName(day)}</p>
                <p className="text-sm font-medium">{getDayLabel(day)}</p>
              </div>
              <div className="space-y-2">
                {daySlots.map((slot) => {
                  const booked = isSlotBooked(slot.id);
                  return (
                    <div
                      key={slot.id}
                      className={`rounded-xl border p-3 ${booked ? 'border-accent-300 bg-accent-50' : slot.published ? 'border-ink-100 bg-white' : 'border-dashed border-ink-200 bg-ink-50 opacity-60'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
                          <Clock size={14} className="text-accent-500" />
                          {formatTime(slot.starts_at)}
                        </div>
                        <span className={`badge ${slot.published ? 'badge-success' : 'badge-neutral'}`}>
                          {slot.published ? 'Public' : 'Ascuns'}
                        </span>
                      </div>
                      {slot.location && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-ink-400">
                          <MapPin size={10} /> {slot.location}
                        </p>
                      )}
                      <p className="mt-1 text-xs font-medium text-ink-600">
                        {booked ? 'Rezervat' : 'Liber'}
                      </p>
                      <div className="mt-2 flex gap-1">
                        <button
                          onClick={() => togglePublish(slot)}
                          disabled={actionLoading || booked}
                          className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100 disabled:opacity-30"
                          title={slot.published ? 'Ascunde' : 'Publică'}
                        >
                          {slot.published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          onClick={() => deleteSlot(slot.id)}
                          disabled={actionLoading || booked}
                          className="rounded-lg p-1.5 text-danger-500 hover:bg-danger-50 disabled:opacity-30"
                          title="Șterge"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {daySlots.length === 0 && <p className="py-4 text-center text-xs text-ink-300">—</p>}
              </div>
            </div>
          );
        })}
      </div>

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
        <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Început" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Input label="Sfârșit" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <Input label="Locație" value={location} onChange={(e) => setLocation(e.target.value)} />
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
