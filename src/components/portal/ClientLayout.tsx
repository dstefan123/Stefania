import { type ReactNode, useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Calendar, MessageCircle, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/portal', label: 'Acasă', icon: Home, end: true },
  { to: '/portal/calendar', label: 'Calendar', icon: Calendar, end: false },
  { to: '/portal/mesaje', label: 'Mesaje', icon: MessageCircle, end: false },
  { to: '/portal/profil', label: 'Profil', icon: User, end: false },
];

export function ClientLayout({ children }: { children?: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/portal">
            <Logo showText={false} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-ink-600 sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-700"
              title="Deconectare"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="flex flex-1">
        <aside className="hidden w-60 shrink-0 border-r border-ink-100 bg-white md:block">
          <nav className="sticky top-16 flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive(item)
                    ? 'bg-ink-950 text-white'
                    : 'text-ink-600 hover:bg-ink-100'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            <Link
              to="/portal/programari"
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                location.pathname.startsWith('/portal/programari')
                  ? 'bg-ink-950 text-white'
                  : 'text-ink-600 hover:bg-ink-100'
              )}
            >
              <Calendar size={18} />
              Programările mele
            </Link>
            <Link
              to="/portal/abonament"
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                location.pathname.startsWith('/portal/abonament')
                  ? 'bg-ink-950 text-white'
                  : 'text-ink-600 hover:bg-ink-100'
              )}
            >
              <User size={18} />
              Abonamentul meu
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
          <div className="container-app py-6">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors',
                isActive(item) ? 'text-accent-600' : 'text-ink-400'
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
