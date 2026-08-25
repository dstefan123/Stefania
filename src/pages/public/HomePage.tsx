import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Dumbbell, Heart, Target, TrendingUp, Users } from 'lucide-react';
import { useCoachProfile } from '@/hooks/useCoachProfile';
import { demoTestimonials } from '@/data/demo';

const services = [
  { icon: Dumbbell, title: 'Personal Training', desc: 'Antrenamente 1-la-1, complet personalizate.' },
  { icon: TrendingUp, title: 'Antrenament de forță', desc: 'Construiește forță și masă musculară.' },
  { icon: Target, title: 'Slăbire & Recompoziție', desc: 'Transformă-ți corpul eficient și sustenabil.' },
  { icon: Heart, title: 'Mobilitate & Postură', desc: 'Îmbunătățește mobilitatea și aliniază postura.' },
];

const stats = [
  { value: '40+', label: 'Clienți activi' },
  { value: '8', label: 'Ani de experiență' },
  { value: '500+', label: 'Ședințe' },
  { value: '100%', label: 'Rezultate reale' },
];

export function HomePage() {
  const { profile } = useCoachProfile();
  const coachPhoto = profile?.photo ?? null;
  const coachBio = profile?.bio ?? 'Antrenor personal certificat cu peste 8 ani de experiență în transformarea corpului și a minții. Specializată în antrenament de forță, recompoziție corporală și mobilitate.';
  const coachSpecialties = profile?.specialties ?? ['Personal Training', 'Antrenament de forță', 'Slăbire și recompoziție', 'Mobilitate și postură', 'Pregătire fizică generală'];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-ink-950 pt-20">
        <div className="absolute inset-0">
          <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800" />
          <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-accent-400/10 blur-3xl" />
        </div>

        <div className="container-app relative z-10 grid gap-12 py-20 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <span className="badge-accent mb-6">Personal Trainer Certificat</span>
            <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-wide text-white sm:text-6xl lg:text-7xl">
              Antrenament<br />
              personal.<br />
              <span className="text-accent-400">Rezultate reale.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-200">
              Programe personalizate și antrenamente construite în jurul obiectivelor tale.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary group">
                Programează-te
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/servicii" className="btn-light bg-white/10 text-white border-white/20 hover:bg-white/20">
                Descoperă serviciile
              </Link>
            </div>
          </div>

          {/* Coach photo */}
          <div className="relative animate-fade-in">
            <div className="mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-xl3 border border-white/10">
              {coachPhoto ? (
                <img src={coachPhoto} alt={profile?.name ?? 'Stefania Moraru'} className="h-full w-full object-cover" />
              ) : (
                <div className="photo-placeholder flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Dumbbell className="h-10 w-10 text-white/60" />
                    </div>
                    <p className="text-sm font-medium text-ink-600">Fotografie Stefania</p>
                    <p className="text-xs text-ink-500">Încarcă poza din Setări</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl2 bg-accent-400 px-6 py-4 shadow-xl sm:block">
              <p className="font-display text-2xl uppercase text-ink-950">8+ ani</p>
              <p className="text-xs font-medium text-ink-800">experiență</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink-100 bg-white py-12">
        <div className="container-app">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl uppercase text-ink-900 sm:text-5xl">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20">
        <div className="container-app">
          <div className="mb-12 max-w-2xl">
            <span className="badge-accent mb-4">Servicii</span>
            <h2 className="section-title">Antrenamente pentru fiecare obiectiv</h2>
            <p className="mt-4 text-ink-500">
              Fiecare program este construit în jurul obiectivelor, nivelului și ritmului tău.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="card group p-6 transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 transition-colors group-hover:bg-accent-400">
                  <service.icon className="h-6 w-6 text-accent-400 group-hover:text-ink-950" />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide text-ink-900">{service.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{service.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/servicii" className="btn-dark group">
              Vezi toate serviciile
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="bg-ink-50 py-20">
        <div className="container-app grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/5] max-w-sm overflow-hidden rounded-xl3">
            {coachPhoto ? (
              <img src={coachPhoto} alt={profile?.name ?? 'Stefania Moraru'} className="h-full w-full object-cover" />
            ) : (
              <div className="photo-placeholder flex h-full items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 text-ink-400" />
                  <p className="text-sm text-ink-500">Fotografie profesională</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <span className="badge-accent mb-4">Despre Stefania</span>
            <h2 className="section-title">Cine este {profile?.name ?? 'Stefania Moraru'}</h2>
            <p className="mt-4 text-ink-600">{coachBio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {coachSpecialties.map((s) => (
                <span key={s} className="badge-neutral">{s}</span>
              ))}
            </div>
            <Link to="/despre" className="btn-dark mt-8 group">
              Află mai multe
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-app">
          <div className="mb-12 text-center">
            <span className="badge-accent mb-4">Rezultate</span>
            <h2 className="section-title">Ce spun clienții</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {demoTestimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-accent-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-ink-600">"{t.text}"</p>
                <div className="mt-4 border-t border-ink-100 pt-4">
                  <p className="font-semibold text-ink-900">{t.name}</p>
                  <p className="text-xs text-accent-600">{t.result}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/rezultate" className="btn-dark group">
              Vezi toate rezultatele
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-950 py-20">
        <div className="container-app text-center">
          <Calendar className="mx-auto mb-6 h-12 w-12 text-accent-400" />
          <h2 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
            Gata să începi?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-300">
            Programează-te astăzi și fă primul pas către rezultate reale.
          </p>
          <Link to="/contact" className="btn-primary mt-8 group">
            Programează-te
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
