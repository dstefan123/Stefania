import { useState } from 'react';
import { Plus, Save, Calendar } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { SubscriptionStatusBadge } from '@/components/ui/Badge';

export function CoachSubscriptionsPage() {
  const { clients, subscriptions, bookings, refresh } = useCoachData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editForm, setEditForm] = useState({ sessions_per_month: 10, period_end: '', extension_days: 0, status: 'active' as string });
  const [saving, setSaving] = useState(false);

  const startEdit = (subId: string) => {
    const sub = subscriptions.find((s) => s.id === subId);
    if (!sub) return;
    setEditingId(subId);
    setEditForm({
      sessions_per_month: sub.sessions_per_month,
      period_end: sub.period_end,
      extension_days: sub.extension_days,
      status: sub.status,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    await supabase.from('subscriptions').update({
      sessions_per_month: editForm.sessions_per_month,
      period_end: editForm.period_end,
      extension_days: editForm.extension_days,
      status: editForm.status,
    }).eq('id', editingId);
    refresh();
    setEditingId(null);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Abonamente</h1>
          <p className="mt-1 text-ink-500">Gestionează abonamentele clienților.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {subscriptions.map((sub) => {
          const client = clients.find((c) => c.id === sub.client_id);
          const completed = bookings.filter((b) => b.client_id === sub.client_id && b.status === 'completed' && b.consumes_session).length;
          const left = Math.max(0, sub.sessions_per_month - completed);
          const percent = sub.sessions_per_month > 0 ? (left / sub.sessions_per_month) * 100 : 0;

          return (
            <Card key={sub.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-ink-900">{client?.name ?? '—'}</p>
                    <SubscriptionStatusBadge status={sub.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(sub.period_start).toLocaleDateString('ro-RO')} → {new Date(sub.period_end).toLocaleDateString('ro-RO')}
                    </span>
                    {sub.extension_days > 0 && (
                      <span className="text-success-600">+{sub.extension_days} zile extensie</span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink-500">{completed} din {sub.sessions_per_month} ședințe</span>
                      <span className="font-medium text-ink-900">{left} rămase</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-accent-400 transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
                <Button variant="light" onClick={() => startEdit(sub.id)}>
                  <Save size={16} /> Editează
                </Button>
              </div>
            </Card>
          );
        })}
        {subscriptions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-ink-400">Nu sunt abonamente.</p>
          </Card>
        )}
      </div>

      <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Editează abonament">
        <div className="space-y-4">
          <div>
            <label className="label">Ședințe pe lună</label>
            <input
              type="number"
              min={1}
              max={30}
              className="input"
              value={editForm.sessions_per_month}
              onChange={(e) => setEditForm({ ...editForm, sessions_per_month: parseInt(e.target.value) || 0 })}
            />
            <p className="mt-1 text-xs text-ink-400">Între 8 și 12 recomandat</p>
          </div>
          <Input
            label="Sfârșit perioadă"
            type="date"
            value={editForm.period_end}
            onChange={(e) => setEditForm({ ...editForm, period_end: e.target.value })}
          />
          <div>
            <label className="label">Zile extensie</label>
            <input
              type="number"
              min={0}
              className="input"
              value={editForm.extension_days}
              onChange={(e) => setEditForm({ ...editForm, extension_days: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            >
              <option value="active">Activ</option>
              <option value="paused">Suspendat</option>
              <option value="expired">Expirat</option>
              <option value="suspended">Suspendat</option>
            </select>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Se salvează...' : 'Salvează'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
