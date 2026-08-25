import { Link } from 'react-router-dom';
import { ArrowRight, Dumbbell, Heart, Target, TrendingUp, Zap } from 'lucide-react';

const services = [
  {
    icon: Dumbbell,
    title: 'Personal Training',
    desc: 'Antrenamente 1-la-1, complet personalizate pentru obiectivele tale. Fiecare mișcare este corectată și optimizată în timp real.',
    features: ['Plan personalizat', 'Corectare posturală', 'Feedback constant', 'Adaptare continuă'],
  },
  {
    icon: TrendingUp,
    title: 'Antrenament de forță',
    desc: 'Construiește forță și masă musculară prin programe structurate, progresive și bazate pe principii dovedite.',
    features: ['Programe progresive', 'Tehnică corectă', 'Tracking progres', 'Periodizare'],
  },
  {
    icon: Target,
    title: 'Slăbire & Recompoziție',
    desc: 'Transformă-ți corpul eficient, pierzând grăsime și menținând masa musculară. Rezultate sustenabile, nu diete extreme.',
    features: ['Strategie calorică', 'Antrenament metabolic', 'Recompoziție', 'Mentenanță'],
  },
  {
    icon: Heart,
    title: 'Mobilitate & Postură',
    desc: 'Îmbunătățește mobilitatea, corectează dezechilibrele posturale și redu durerile cauzate de stilul de viață sedentar.',
    features: ['Evaluare posturală', 'Exerciții de mobilitate', 'Corecții posturale', 'Prevenție accidentări'],
  },
  {
    icon: Zap,
    title: 'Pregătire fizică generală',
    desc: 'Indiferent de nivelul tău, construiește o bază solidă de fitness pentru o viață activă și sănătoasă.',
    features: ['Conditioning general', 'Revenire după pauză', 'Bază de fitness', 'Energie și vitalitate'],
  },
];

export function ServicesPage() {
  return (
    <>
      <section className="bg-ink-950 py-20 pt-32">
        <div className="container-app">
          <div className="max-w-3xl">
            <span className="badge-accent mb-4">Servicii</span>
            <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Programe pentru<br /> fiecare obiectiv
            </h1>
            <p className="mt-6 text-lg text-ink-200">
              Indiferent de nivelul tău sau de obiectivul pe care îl ai, există un program construit pentru tine.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-app">
          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="card group p-8 transition-all hover:shadow-lg">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-ink-950 transition-colors group-hover:bg-accent-400">
                  <service.icon className="h-7 w-7 text-accent-400 group-hover:text-ink-950" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-ink-900">{service.title}</h3>
                <p className="mt-3 text-ink-600">{service.desc}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-20">
        <div className="container-app text-center">
          <h2 className="section-title">Nu știi ce ți se potrivește?</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-500">
            Programează o consultație și vom găsi împreună programul potrivit pentru obiectivele tale.
          </p>
          <Link to="/contact" className="btn-primary mt-8 group">
            Programează o consultație
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
