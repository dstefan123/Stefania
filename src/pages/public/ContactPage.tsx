import { useState } from 'react';
import { Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { demoCoachProfile } from '@/data/demo';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <section className="bg-ink-950 py-20 pt-32">
        <div className="container-app">
          <div className="max-w-3xl">
            <span className="badge-accent mb-4">Contact</span>
            <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Hai să vorbim
            </h1>
            <p className="mt-6 text-lg text-ink-200">
              Ai întrebări sau vrei să programezi o ședință? Completează formularul și te contactez cât mai curând.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-app grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2 className="section-title">Informații contact</h2>
            <p className="mt-4 text-ink-500">
              Stefania Moraru — antrenor personal în {demoCoachProfile.location}.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 rounded-xl2 border border-ink-100 bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950">
                  <Mail className="h-5 w-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Email</p>
                  <p className="font-medium text-ink-900">{demoCoachProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl2 border border-ink-100 bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950">
                  <Phone className="h-5 w-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Telefon</p>
                  <p className="font-medium text-ink-900">{demoCoachProfile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl2 border border-ink-100 bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950">
                  <Instagram className="h-5 w-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Instagram</p>
                  <p className="font-medium text-ink-900">{demoCoachProfile.instagram}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl2 border border-ink-100 bg-white p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950">
                  <MapPin className="h-5 w-5 text-accent-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Locație</p>
                  <p className="font-medium text-ink-900">{demoCoachProfile.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div className="card p-8">
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink-900">Trimite un mesaj</h2>
              {submitted ? (
                <div className="mt-6 rounded-xl2 bg-success-50 p-6 text-center">
                  <p className="font-medium text-success-700">Mesaj trimis cu succes!</p>
                  <p className="mt-1 text-sm text-success-600">Te contactez cât mai curând posibil.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Input
                    label="Nume complet"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Telefon"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <Textarea
                    label="Mesaj"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Trimite mesaj
                    <Send size={16} />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
