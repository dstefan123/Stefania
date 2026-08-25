import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ClientStatusBadge } from '@/components/ui/Badge';
import { Check, Upload, Trash2, User } from 'lucide-react';
import type { Profile, Client } from '@/types';

export function ClientProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('clients').select('*').eq('user_id', user.id).maybeSingle(),
    ]).then(([profileRes, clientRes]) => {
      const p = profileRes.data as Profile | null;
      const c = clientRes.data as Client | null;
      setProfile(p);
      setClient(c);
      setForm({ full_name: p?.full_name ?? '', phone: p?.phone ?? '' });
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    if (profile) {
      await supabase
        .from('profiles')
        .update({ full_name: form.full_name, phone: form.phone })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('profiles')
        .insert({ user_id: user.id, full_name: form.full_name, phone: form.phone });
      setProfile({ user_id: user.id, full_name: form.full_name, phone: form.phone, avatar: null, created_at: new Date().toISOString() });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Imaginea este prea mare. Maxim 5MB.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filePath = `${user.id}/avatar.${ext}`;

    if (profile?.avatar) {
      const oldPath = profile.avatar.split('/avatars/')[1]?.split('?')[0];
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }
    }

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadErr) {
      setUploadError('Nu am putut încărca imaginea.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const url = `${publicUrl}?t=${Date.now()}`;

    if (profile) {
      await supabase.from('profiles').update({ avatar: url }).eq('user_id', user.id);
    } else {
      await supabase.from('profiles').insert({ user_id: user.id, full_name: form.full_name, phone: form.phone, avatar: url });
    }

    setProfile(prev => prev ? { ...prev, avatar: url } : { user_id: user.id, full_name: form.full_name, phone: form.phone, avatar: url, created_at: new Date().toISOString() });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAvatarRemove = async () => {
    if (!profile?.avatar || !user) return;
    const oldPath = profile.avatar.split('/avatars/')[1]?.split('?')[0];
    if (oldPath) {
      await supabase.storage.from('avatars').remove([oldPath]);
    }
    await supabase.from('profiles').update({ avatar: null }).eq('user_id', user.id);
    setProfile({ ...profile, avatar: null });
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Profilul meu</h1>
        <p className="mt-1 text-ink-500">Datele personale și setările contului.</p>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Fotografie</h2>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-ink-200 bg-ink-50">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User size={28} className="text-ink-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={16} />
              {uploading ? 'Se încarcă...' : profile?.avatar ? 'Schimbă poza' : 'Încarcă poză'}
            </Button>
            {profile?.avatar && (
              <Button variant="ghost" onClick={handleAvatarRemove} className="text-danger-600">
                <Trash2 size={16} /> Elimină
              </Button>
            )}
            {uploadError && <p className="text-sm text-danger-600">{uploadError}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Date personale</h2>
        <div className="mt-4 space-y-4">
          <Input
            label="Nume complet"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <Input
            label="Telefon"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div>
            <label className="label">Email</label>
            <input className="input bg-ink-50" value={user?.email ?? ''} disabled />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Se salvează...' : 'Salvează modificările'}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-success-600">
              <Check size={16} /> Salvat
            </span>
          )}
        </div>
      </Card>

      {client && (
        <Card className="p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Informații client</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between rounded-xl bg-ink-50 px-4 py-3">
              <span className="text-sm text-ink-500">Status</span>
              <ClientStatusBadge status={client.status} />
            </div>
            {client.goal && (
              <div className="flex justify-between rounded-xl bg-ink-50 px-4 py-3">
                <span className="text-sm text-ink-500">Obiectiv</span>
                <span className="text-sm font-medium text-ink-900">{client.goal}</span>
              </div>
            )}
            <div className="flex justify-between rounded-xl bg-ink-50 px-4 py-3">
              <span className="text-sm text-ink-500">Membru din</span>
              <span className="text-sm font-medium text-ink-900">
                {new Date(client.joined_at).toLocaleDateString('ro-RO')}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
