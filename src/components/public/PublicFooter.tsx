import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { demoCoachProfile } from '@/data/demo';

export function PublicFooter() {
  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-app py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo className="[&_span]:text-white [&_span.block]:text-ink-400" />
            <p className="mt-4 max-w-sm text-sm text-ink-300">
              {demoCoachProfile.tagline}. Programe personalizate și antrenamente construite în jurul obiectivelor tale.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm uppercase tracking-wider text-ink-200">Navigare</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-ink-300 hover:text-white">Acasă</Link></li>
              <li><Link to="/despre" className="text-ink-300 hover:text-white">Despre</Link></li>
              <li><Link to="/servicii" className="text-ink-300 hover:text-white">Servicii</Link></li>
              <li><Link to="/rezultate" className="text-ink-300 hover:text-white">Rezultate</Link></li>
              <li><Link to="/contact" className="text-ink-300 hover:text-white">Contact</Link></li>
              <li><Link to="/login" className="text-ink-300 hover:text-white">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm uppercase tracking-wider text-ink-200">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-ink-300">
                <Mail size={16} className="text-accent-400" />
                {demoCoachProfile.email}
              </li>
              <li className="flex items-center gap-2 text-ink-300">
                <Phone size={16} className="text-accent-400" />
                {demoCoachProfile.phone}
              </li>
              <li className="flex items-center gap-2 text-ink-300">
                <Instagram size={16} className="text-accent-400" />
                {demoCoachProfile.instagram}
              </li>
              <li className="flex items-center gap-2 text-ink-300">
                <MapPin size={16} className="text-accent-400" />
                {demoCoachProfile.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-800 pt-6 text-center text-xs text-ink-400">
          © {new Date().getFullYear()} Stefania Moraru. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}
