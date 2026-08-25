import { useState, useEffect, useRef, useCallback } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { formatTime } from '@/lib/format';
import type { Message } from '@/types';

export function ClientMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (clientData) {
      setClientId(clientData.id);
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: true });
      setMessages((msgData ?? []) as Message[]);

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('client_id', clientData.id)
        .eq('sender', 'coach')
        .is('read_at', null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !clientId) return;
    setSending(true);
    const body = input.trim();
    setInput('');

    const optimistic: Message = {
      id: 'temp-' + Date.now(),
      client_id: clientId,
      sender: 'client',
      body,
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const { error } = await supabase
      .from('messages')
      .insert({ client_id: clientId, sender: 'client', body });

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
    setSending(false);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Mesaje</h1>
        <p className="mt-1 text-ink-500">Conversație cu Stefania.</p>
      </div>

      <Card className="flex h-[60vh] flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-ink-400">Nu ai mesaje. Trimite primul mesaj!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.sender === 'client'
                        ? 'bg-ink-950 text-white'
                        : 'bg-ink-100 text-ink-900'
                    }`}
                  >
                    <p>{m.body}</p>
                    <p className={`mt-1 text-xs ${m.sender === 'client' ? 'text-ink-400' : 'text-ink-400'}`}>
                      {formatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="border-t border-ink-100 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !sending && handleSend()}
              placeholder="Scrie un mesaj..."
              className="input flex-1"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-400 text-ink-950 transition-colors hover:bg-accent-300 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
