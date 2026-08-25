import { useState, useEffect, useRef } from 'react';
import { Save, Check, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import type { CoachProfile } from '@/types';

export function CoachSettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [form, setForm] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('coach_profile').select('*').limit(1).maybeSingle().then(({ data }) => {
      const p = data as CoachProfile | null;
      setProfile(p);
      setForm(p);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    await supabase.from('coach_profile').update({
      name: form.name,
      bio: form.bio,
      tagline: form.tagline,
      specialties: form.specialties,
      location: form.location,
      email: form.email,
      phone: form.phone,
      instagram: form.instagram,
    }).eq('id', form.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Imaginea este prea mare. Maxim 5MB.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filePath = `coach/photo.${ext}`;

    if (profile?.photo) {
      const oldPath = profile.photo.split('/avatars/')[1];
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }
    }

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setUploadError('Nu am putut încărca imaginea.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const url = `${publicUrl}?t=${Date.now()}`;

    await supabase.from('coach_profile').update({ photo: url }).eq('id', form!.id);
    setForm({ ...form!, photo: url });
    setProfile(profile ? { ...profile, photo: url } : null);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handlePhotoRemove = async () => {
    if (!form?.photo || !user) return;
    const oldPath = form.photo.split('/avatars/')[1]?.split('?')[0];
    if (oldPath) {
      await supabase.storage.from('avatars').remove([oldPath]);
    }
    await supabase.from('coach_profile').update({ photo: null }).eq('id', form.id);
    setForm({ ...form, photo: null });
    setProfile(profile ? { ...profile, photo: null } : null);
  };

  if (loading || !form) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Setări</h1>
        <p className="mt-1 text-ink-500">Profilul public și informațiile de contact.</p>
      </div>

      <Card className="p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Fotografie de profil</h2>
        <p className="mt-1 text-sm text-ink-500">Această poză apare pe site-ul public, în pagina Despre și pe homepage.</p>

        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-xl2 border border-ink-200 bg-ink-50">
            {form.photo ? (
              <img src={form.photo} alt="Profil" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon size={32} className="text-ink-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload size={16} />
              {uploading ? 'Se încarcă...' : form.photo ? 'Schimbă poza' : 'Încarcă poză'}
            </Button>
            {form.photo && (
              <Button variant="ghost" onClick={handlePhotoRemove} className="text-danger-600">
                <Trash2 size={16} /> Elimină
              </Button>
            )}
            {uploadError && <p className="text-sm text-danger-600">{uploadError}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Profil public</h2>
        <div className="mt-4 space-y-4">
          <Input label="Nume" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <Textarea label="Bio" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <Input label="Locație" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input
            label="Specializări (separate prin virgulă)"
            value={form.specialties.join(', ')}
            onChange={(e) => setForm({ ...form, specialties: e.target.value.split(',').map((s) => s.trim()) })}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg uppercase tracking-wide text-ink-900">Contact</h2>
        <div className="mt-4 space-y-4">
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Se salvează...' : 'Salvează'}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success-600">
            <Check size={16} /> Salvat
          </span>
        )}
      </div>
    </div>
  );
}
