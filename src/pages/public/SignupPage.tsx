import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'coach' ? '/coach' : '/portal', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Parolele nu coincid.');
      return;
    }
    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere.');
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        role: 'client',
      });
      await supabase.from('profiles').upsert({
        user_id: data.user.id,
        full_name: name,
      });
    }

    setLoading(false);
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
            <h1 className="font-display text-2xl uppercase tracking-wide text-ink-900">Cont nou</h1>
            <p className="mt-2 text-sm text-ink-500">
              Creează un cont pentru a rezerva ședințe și a accesa portalul tău.
            </p>

            {error && (
              <div className="mt-4 rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="label">Nume complet</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="Numele tău"
                  />
                </div>
              </div>
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
              <div>
                <label htmlFor="confirm" className="label">Confirmă parola</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Se creează...' : 'Creează cont'}
                {!loading && <UserPlus size={16} />}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
              Ai deja cont?{' '}
              <Link to="/login" className="font-medium text-accent-600 hover:text-accent-700">
                Conectează-te
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
