import { useState } from 'react';
import { Plus, Megaphone, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';

export function CoachAnnouncementsPage() {
  const { announcements, refresh } = useCoachData();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', published: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    const { error: insertError } = await supabase.from('announcements').insert({
      title: form.title,
      body: form.body,
      published: form.published,
    });
    if (insertError) {
      setError('Nu am putut crea anunțul.');
    } else {
      refresh();
      setShowCreate(false);
      setForm({ title: '', body: '', published: true });
    }
    setSaving(false);
  };

  const togglePublish = async (id: string, published: boolean) => {
    await supabase.from('announcements').update({ published: !published }).eq('id', id);
    refresh();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Anunțuri</h1>
          <p className="mt-1 text-ink-500">Comunică către toți clienții.</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Anunț nou
        </Button>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Megaphone size={18} className="text-accent-500" />
                  <p className="font-semibold text-ink-900">{a.title}</p>
                  <span className={`badge ${a.published ? 'badge-success' : 'badge-neutral'}`}>
                    {a.published ? 'Publicat' : 'Draft'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-600">{a.body}</p>
                <p className="mt-2 text-xs text-ink-400">
                  {new Date(a.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => togglePublish(a.id, a.published)}
                  className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"
                  title={a.published ? 'Ascunde' : 'Publică'}
                >
                  {a.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="rounded-lg p-2 text-danger-500 hover:bg-danger-50"
                  title="Șterge"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {announcements.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-ink-400">Nu sunt anunțuri.</p>
          </Card>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Anunț nou">
        <div className="space-y-4">
          {error && <div className="rounded-xl bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}
          <Input label="Titlu" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Mesaj" rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 rounded border-ink-300" />
            <span className="text-sm text-ink-700">Publicat imediat</span>
          </label>
          <Button onClick={handleCreate} disabled={saving || !form.title || !form.body} className="w-full">
            {saving ? 'Se salvează...' : 'Publică anunț'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
