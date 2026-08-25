import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Client, Subscription, Booking, AvailabilitySlot, Message, Announcement, Vacation, ManualOverride } from '@/types';

export interface CoachData {
  clients: Client[];
  subscriptions: Subscription[];
  bookings: (Booking & { slot: AvailabilitySlots; client: Client })[];
  slots: AvailabilitySlot[];
  messages: Message[];
  announcements: Announcement[];
  vacations: Vacation[];
  overrides: ManualOverride[];
  loading: boolean;
  refresh: () => void;
}

type AvailabilitySlots = AvailabilitySlot;

export function useCoachData(): CoachData {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [bookings, setBookings] = useState<(Booking & { slot: AvailabilitySlot; client: Client })[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [overrides, setOverrides] = useState<ManualOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [clientsRes, subsRes, slotsRes, bookingsRes, messagesRes, announcementsRes, vacationsRes, overridesRes] = await Promise.all([
      supabase.from('clients').select('*').order('name', { ascending: true }),
      supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
      supabase.from('availability_slots').select('*').order('starts_at', { ascending: true }),
      supabase.from('bookings').select('*, slot:availability_slots(*), client:clients(*)').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('vacations').select('*').order('start_date', { ascending: true }),
      supabase.from('manual_overrides').select('*').order('created_at', { ascending: false }).limit(50),
    ]);

    setClients((clientsRes.data ?? []) as Client[]);
    setSubscriptions((subsRes.data ?? []) as Subscription[]);
    setSlots((slotsRes.data ?? []) as AvailabilitySlot[]);
    setBookings((bookingsRes.data ?? []) as unknown as (Booking & { slot: AvailabilitySlot; client: Client })[]);
    setMessages((messagesRes.data ?? []) as Message[]);
    setAnnouncements((announcementsRes.data ?? []) as Announcement[]);
    setVacations((vacationsRes.data ?? []) as Vacation[]);
    setOverrides((overridesRes.data ?? []) as ManualOverride[]);

    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return { clients, subscriptions, bookings, slots, messages, announcements, vacations, overrides, loading, refresh: load };
}
