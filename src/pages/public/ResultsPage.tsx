import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';
import { demoTestimonials, demoTransformations } from '@/data/demo';

export function ResultsPage() {
  return (
    <>
      <section className="bg-ink-950 py-20 pt-32">
        <div className="container-app">
          <div className="max-w-3xl">
            <span className="badge-accent mb-4">Rezultate</span>
            <h1 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl lg:text-6xl">
              Transformări reale
            </h1>
            <p className="mt-6 text-lg text-ink-200">
              Clienții care au schimbat viața prin antrenament, disciplină și consecvență.
            </p>
          </div>
        </div>
      </section>

      {/* Transformations */}
      <section className="py-20">
        <div className="container-app">
          <div className="mb-12 text-center">
            <h2 className="section-title">Transformări</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">
              Rezultate obținute prin programe personalizate și consecvență.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {demoTransformations.map((t) => (
              <div key={t.name} className="card group overflow-hidden">
                <div className="aspect-[3/4] photo-placeholder transition-all group-hover:opacity-90">
                  <div className="flex h-full items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-ink-400" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink-900">{t.name}</p>
                    <span className="badge-accent">{t.period}</span>
                  </div>
                  <p className="mt-2 font-display text-2xl uppercase text-accent-600">{t.stat}</p>
                  <p className="text-sm text-ink-500">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink-50 py-20">
        <div className="container-app">
          <div className="mb-12 text-center">
            <h2 className="section-title">Testimoniale</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">
              Ce spun clienții despre experiența cu Stefania.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {demoTestimonials.map((t) => (
              <div key={t.name} className="card p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <p className="text-lg text-ink-700">"{t.text}"</p>
                <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-4">
                  <div>
                    <p className="font-semibold text-ink-900">{t.name}</p>
                    <p className="text-sm text-accent-600">{t.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-app text-center">
          <h2 className="section-title">Vrei să fii următoarea transformare?</h2>
          <p className="mx-auto mt-4 max-w-md text-ink-500">
            Începe astăzi. Programează-te și fă primul pas către rezultate reale.
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
