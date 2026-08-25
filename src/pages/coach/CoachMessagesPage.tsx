import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search } from 'lucide-react';
import { useCoachData } from '@/hooks/useCoachData';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Message, Client } from '@/types';

export function CoachMessagesPage() {
  const { clients, messages, refresh } = useCoachData();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const clientsWithMessages = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    messages.some((m) => m.client_id === c.id)
  );

  const unreadCount = (clientId: string) => messages.filter((m) => m.client_id === clientId && m.sender === 'client' && !m.read_at).length;

  const loadConversation = useCallback(async (clientId: string) => {
    setSelectedClientId(clientId);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });
    setConversation((data ?? []) as Message[]);

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('client_id', clientId)
      .eq('sender', 'client')
      .is('read_at', null);
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedClientId) loadConversation(selectedClientId);
  }, [selectedClientId, loadConversation]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = async () => {
    if (!input.trim() || !selectedClientId) return;
    setSending(true);
    const body = input.trim();
    setInput('');

    const optimistic: Message = {
      id: 'temp-' + Date.now(),
      client_id: selectedClientId,
      sender: 'coach',
      body,
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setConversation((prev) => [...prev, optimistic]);

    const { error } = await supabase
      .from('messages')
      .insert({ client_id: selectedClientId, sender: 'coach', body });

    if (error) {
      setConversation((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
    setSending(false);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-ink-900">Mesaje</h1>
        <p className="mt-1 text-ink-500">Conversații cu clienții.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Conversation list */}
        <Card className="overflow-hidden lg:col-span-1">
          <div className="border-b border-ink-100 p-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                className="input pl-9 text-sm"
                placeholder="Caută client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {clientsWithMessages.map((c) => (
              <button
                key={c.id}
                onClick={() => loadConversation(c.id)}
                className={cn(
                  'flex w-full items-center justify-between border-b border-ink-50 px-4 py-3 text-left transition-colors hover:bg-ink-50',
                  selectedClientId === c.id && 'bg-ink-100'
                )}
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">{c.name}</p>
                  <p className="text-xs text-ink-400">{c.email}</p>
                </div>
                {unreadCount(c.id) > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-400 px-1.5 text-xs font-bold text-ink-950">
                    {unreadCount(c.id)}
                  </span>
                )}
              </button>
            ))}
            {clientsWithMessages.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-400">Nu sunt clienți.</p>
            )}
          </div>
        </Card>

        {/* Chat */}
        <Card className="flex h-[60vh] flex-col overflow-hidden lg:col-span-2">
          {selectedClient ? (
            <>
              <div className="border-b border-ink-100 px-4 py-3">
                <p className="font-semibold text-ink-900">{selectedClient.name}</p>
                <p className="text-xs text-ink-400">{selectedClient.email}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {conversation.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === 'coach' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          m.sender === 'coach' ? 'bg-ink-950 text-white' : 'bg-ink-100 text-ink-900'
                        }`}
                      >
                        <p>{m.body}</p>
                        <p className="mt-1 text-xs text-ink-400">{formatTime(m.created_at)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
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
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-ink-400">Selectează un client pentru a începe conversația.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
