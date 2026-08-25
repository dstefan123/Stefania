import { useState } from 'react';
import { Search, Plus, Mail, Phone, Target, User } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { ClientStatusBadge, SubscriptionStatusBadge } from '@/components/ui/Badge';

export function CoachClientsPage() {
  const { clients, subscriptions, bookings, refresh } = useCoachData();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selected = clients.find((c) => c.id === selectedClient);
  const selectedSub = subscriptions.find((s) => s.client_id === selectedClient);
  const selectedBookings = bookings.filter((b) => b.client_id === selectedClient);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Clienți</h1>
          <p className="mt-1 text-ink-500">{clients.length} clienți înregistrați.</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Client nou
        </Button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          className="input pl-10"
          placeholder="Caută client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((c) => {
          const sub = subscriptions.find((s) => s.client_id === c.id);
          const completed = bookings.filter((b) => b.client_id === c.id && b.status === 'completed' && b.consumes_session).length;
          return (
            <Card key={c.id} className="cursor-pointer p-4 transition-all hover:shadow-md" onClick={() => setSelectedClient(c.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950">
                    <User size={20} className="text-accent-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{c.name}</p>
                    <p className="text-sm text-ink-500">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {sub && (
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-ink-900">{completed}/{sub.sessions_per_month} ședințe</p>
                      <SubscriptionStatusBadge status={sub.status} />
                    </div>
                  )}
                  <ClientStatusBadge status={c.status} />
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-ink-400">Nu au fost găsiți clienți.</p>
          </Card>
        )}
      </div>

      {/* Client detail modal */}
      <Modal open={!!selectedClient} onClose={() => setSelectedClient(null)} title={selected?.name ?? ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value={selected.email} />
              <InfoRow icon={Phone} label="Telefon" value={selected.phone ?? '—'} />
              <InfoRow icon={Target} label="Obiectiv" value={selected.goal ?? '—'} />
              <div>
                <p className="text-xs text-ink-400">Status</p>
                <div className="mt-1"><ClientStatusBadge status={selected.status} /></div>
              </div>
            </div>

            {selected.notes && (
              <div className="rounded-xl bg-ink-50 p-4">
                <p className="text-xs text-ink-400">Notițe</p>
                <p className="mt-1 text-sm text-ink-700">{selected.notes}</p>
              </div>
            )}

            {selectedSub && (
              <div className="rounded-xl2 border border-ink-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm uppercase tracking-wide text-ink-900">Abonament</p>
                  <SubscriptionStatusBadge status={selectedSub.status} />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-display text-xl text-ink-900">{selectedSub.sessions_per_month}</p>
                    <p className="text-xs text-ink-400">Ședințe/lună</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-ink-900">
                      {bookings.filter((b) => b.client_id === selected.id && b.status === 'completed' && b.consumes_session).length}
                    </p>
                    <p className="text-xs text-ink-400">Efectuate</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-ink-900">{selectedSub.extension_days}</p>
                    <p className="text-xs text-ink-400">Zile extensie</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 font-display text-sm uppercase tracking-wide text-ink-900">Programări recente</p>
              <div className="space-y-2">
                {selectedBookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-2.5">
                    <span className="text-sm text-ink-700">
                      {new Date(b.slot.starts_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <StatusBadgeMini status={b.status} />
                  </div>
                ))}
                {selectedBookings.length === 0 && <p className="text-sm text-ink-400">Nu sunt programări.</p>}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <AddClientModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={refresh} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-900">
        <Icon size={14} className="text-ink-400" /> {value}
      </p>
    </div>
  );
}

function StatusBadgeMini({ status }: { status: string }) {
  const labels: Record<string, string> = {
    scheduled: 'Programată', completed: 'Finalizată', cancelled: 'Anulată', no_show: 'No-show',
  };
  const colors: Record<string, string> = {
    scheduled: 'badge-accent', completed: 'badge-success', cancelled: 'badge-neutral', no_show: 'badge-danger',
  };
  return <span className={`badge ${colors[status] ?? 'badge-neutral'}`}>{labels[status] ?? status}</span>;
}

function AddClientModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', goal: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: insertError } = await supabase.from('clients').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      goal: form.goal || null,
      notes: form.notes || null,
      status: 'active',
    });
    if (insertError) {
      setError('Nu am putut adăuga clientul.');
    } else {
      onCreated();
      onClose();
      setForm({ name: '', email: '', phone: '', goal: '', notes: '' });
    }
    setSaving(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Client nou">
      <div className="space-y-4">
        {error && <div className="rounded-xl bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}
        <Input label="Nume" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Obiectiv" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
        <Textarea label="Notițe" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <Button onClick={handleSave} disabled={saving || !form.name || !form.email} className="w-full">
          {saving ? 'Se salvează...' : 'Adaugă client'}
        </Button>
      </div>
    </Modal>
  );
}
