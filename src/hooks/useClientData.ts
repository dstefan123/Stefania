import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Client, Subscription, Booking, AvailabilitySlot, Message, Announcement, AppNotification } from '@/types';

export interface ClientData {
  client: Client | null;
  subscription: Subscription | null;
  bookings: (Booking & { slot: AvailabilitySlot })[];
  messages: Message[];
  announcements: Announcement[];
  notifications: AppNotification[];
  loading: boolean;
  refresh: () => void;
}

export function useClientData(): ClientData {
  const { user } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bookings, setBookings] = useState<(Booking & { slot: AvailabilitySlot })[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setClient(clientData as Client | null);

    if (clientData) {
      const [subRes, bookingsRes, messagesRes, announcementsRes, notificationsRes] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('bookings')
          .select('*, slot:availability_slots(*)')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('messages')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('announcements')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      setSubscription(subRes.data as Subscription | null);
      setBookings((bookingsRes.data ?? []) as (Booking & { slot: AvailabilitySlot })[]);
      setMessages((messagesRes.data ?? []) as Message[]);
      setAnnouncements((announcementsRes.data ?? []) as Announcement[]);
      setNotifications((notificationsRes.data ?? []) as AppNotification[]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { client, subscription, bookings, messages, announcements, notifications, loading, refresh: load };
}
