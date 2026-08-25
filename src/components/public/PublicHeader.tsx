import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Acasă' },
  { to: '/despre', label: 'Despre' },
  { to: '/servicii', label: 'Servicii' },
  { to: '/rezultate', label: 'Rezultate' },
  { to: '/contact', label: 'Contact' },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="container-app flex h-16 items-center justify-between sm:h-20">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'text-sm font-medium transition-colors hover:text-ink-900',
                location.pathname === link.to ? 'text-ink-900' : 'text-ink-500'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="btn-dark px-5 py-2.5 text-sm">
            Login
          </Link>
        </nav>

        <button
          className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <nav className="container-app flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  location.pathname === link.to ? 'bg-ink-100 text-ink-900' : 'text-ink-600 hover:bg-ink-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" className="btn-dark mt-2">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
