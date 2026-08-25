import { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, BookMarked, Clock,
  CreditCard, MessageCircle, Megaphone, BarChart3, Settings,
  LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/coach', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/coach/calendar', label: 'Calendar', icon: Calendar, end: false },
  { to: '/coach/clienti', label: 'Clienți', icon: Users, end: false },
  { to: '/coach/programari', label: 'Programări', icon: BookMarked, end: false },
  { to: '/coach/sloturi', label: 'Sloturi', icon: Clock, end: false },
  { to: '/coach/abonamente', label: 'Abonamente', icon: CreditCard, end: false },
  { to: '/coach/mesaje', label: 'Mesaje', icon: MessageCircle, end: false },
  { to: '/coach/anunturi', label: 'Anunțuri', icon: Megaphone, end: false },
  { to: '/coach/rapoarte', label: 'Rapoarte', icon: BarChart3, end: false },
  { to: '/coach/setari', label: 'Setări', icon: Settings, end: false },
];

export function CoachLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname === item.to || location.pathname.startsWith(item.to + '/');
  };

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-ink-100 bg-white md:block">
        <div className="flex h-16 items-center border-b border-ink-100 px-5">
          <Link to="/coach">
            <Logo showText={false} />
          </Link>
          <div className="ml-3">
            <span className="font-display text-sm uppercase tracking-wider text-ink-900">Dashboard</span>
            <p className="text-[10px] text-ink-400">Antrenor</p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                isActive(item)
                  ? 'bg-ink-950 text-white'
                  : 'text-ink-600 hover:bg-ink-100'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-100"
          >
            <LogOut size={18} />
            Deconectare
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white">
            <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
              <Logo showText={false} />
              <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive(item) ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-100"
              >
                <LogOut size={18} />
                Deconectare
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/95 px-4 backdrop-blur-md md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-ink-100">
            <Menu size={22} />
          </button>
          <Logo showText={false} />
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="container-app py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
