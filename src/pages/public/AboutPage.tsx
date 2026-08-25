import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, Target, Users } from 'lucide-react';
import { useCoachProfile } from '@/hooks/useCoachProfile';

const philosophy = [
  { icon: Target, title: 'Personalizare', desc: 'Fiecare program este construit în jurul obiectivelor, nivelului și ritmului tău.' },
  { icon: Heart, title: 'Sustenabilitate', desc: 'Rezultate care durează, fără diete extreme sau antrenamente periculoase.' },
  { icon: Award, title: 'Profesionalism', desc: 'Experiență certificată și atenție la detalii în fiecare ședință.' },
  { icon: Users, title: 'Suport continuu', desc: 'Nu ești singur. Te ghidesc la fiecare pas, din prima până la ultima repetare.' },
];

export function AboutPage() {
  const { profile } = useCoachProfile();
  const coachPhoto = profile?.photo ?? null;
  const coachName = profile?.name ?? 'Stefania Moraru';
  const coachTagline = profile?.tagline ?? 'Antrenament personal. Rezultate reale.';
  const coachBio = profile?.bio ?? 'Antrenor personal certificat cu peste 8 ani de experiență în transformarea corpului și a minții. Specializată în antrenament de forță, recompoziție corporală și mobilitate. Filosofia mea este simplă: rezultate sustenabile prin planuri personalizate, disciplină și consecvență.';
  const coachSpecialties = profile?.specialties ?? ['Personal Training', 'Antrenament de forță', 'Slăbire și recompoziție', 'Mobilitate și postură', 'Pregătire fizică generală'];

  return (
    <>
      <section className="bg-ink-950 py-20 pt-32">
        <div className="container-app">
          <div className="max-w-3xl">
            <span className="badge-accent mb-4">Despre</span>
            <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              {coachName}
            </h1>
            <p className="mt-6 text-lg text-ink-200">{coachTagline}</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-app grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="aspect-[4/5] max-w-md overflow-hidden rounded-xl3">
            {coachPhoto ? (
              <img src={coachPhoto} alt={coachName} className="h-full w-full object-cover" />
            ) : (
              <div className="photo-placeholder flex h-full items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 text-ink-400" />
                  <p className="text-sm text-ink-500">Fotografie profesională</p>
                  <p className="text-xs text-ink-400">Încarcă poza din Setări</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="section-title">Experiență și filosofie</h2>
            <p className="mt-4 text-ink-600">{coachBio}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl2 border border-ink-100 bg-ink-50 p-5">
                <p className="font-display text-3xl uppercase text-ink-900">8+</p>
                <p className="text-sm text-ink-500">Ani de experiență</p>
              </div>
              <div className="rounded-xl2 border border-ink-100 bg-ink-50 p-5">
                <p className="font-display text-3xl uppercase text-ink-900">40+</p>
                <p className="text-sm text-ink-500">Clienți activi</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-3 font-display text-lg uppercase tracking-wide text-ink-900">Specializări</h3>
              <div className="flex flex-wrap gap-2">
                {coachSpecialties.map((s) => (
                  <span key={s} className="badge-neutral">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-20">
        <div className="container-app">
          <div className="mb-12 text-center">
            <span className="badge-accent mb-4">Filosofia</span>
            <h2 className="section-title">Abordarea mea</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">
              Patru principii care ghidează fiecare antrenament și fiecare program pe care îl construiesc.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {philosophy.map((item) => (
              <div key={item.title} className="card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950">
                  <item.icon className="h-6 w-6 text-accent-400" />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-app text-center">
          <h2 className="section-title">Vrei să lucrăm împreună?</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-500">
            Programează o primă ședință și descoperă cum arată un antrenament construit pentru tine.
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
