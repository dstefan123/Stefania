import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'coach' ? '/coach' : '/portal', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block">
              <Logo className="justify-center [&_span]:text-white [&_span.block]:text-ink-400" />
            </Link>
          </div>

          <div className="card bg-white p-8">
            <h1 className="font-display text-2xl uppercase tracking-wide text-ink-900">Conectare</h1>
            <p className="mt-2 text-sm text-ink-500">
              Accesează portalul client sau dashboard-ul antrenorului.
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="label">Parolă</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Se conectează...' : 'Conectare'}
                {!loading && <ArrowRight size={16} />}
              </Button>
            </form>

            <div className="mt-6 rounded-xl bg-ink-50 p-4 text-xs text-ink-500">
              <p className="font-semibold text-ink-700">Conte demo:</p>
              <p className="mt-1">Antrenor: stefania@stefaniamoraru.ro / demo1234</p>
              <p>Client: ana@example.com / demo1234</p>
            </div>
            <p className="mt-4 text-center text-sm text-ink-500">
              Nu ai cont?{' '}
              <Link to="/signup" className="font-medium text-accent-600 hover:text-accent-700">
                Creează un cont nou
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-ink-400">
            <Link to="/" className="hover:text-white">← Înapoi la site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
