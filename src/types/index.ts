export type UserRole = 'coach' | 'client';

export type BookingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export type SubscriptionStatus = 'active' | 'paused' | 'expired' | 'suspended';

export type ClientStatus = 'active' | 'paused' | 'inactive';

export type VacationScope = 'coach' | 'client';

export type OverrideAction =
  | 'return_session'
  | 'cancel_booking'
  | 'move_booking'
  | 'mark_no_show'
  | 'change_session_count'
  | 'change_subscription_period'
  | 'create_slot'
  | 'manual_booking';

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'message'
  | 'announcement'
  | 'subscription'
  | 'system';

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar: string | null;
  created_at: string;
}

export interface CoachProfile {
  id: string;
  name: string;
  bio: string;
  tagline: string;
  specialties: string[];
  photo: string | null;
  location: string;
  email: string;
  phone: string;
  instagram: string;
}

export interface Client {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  goal: string | null;
  notes: string | null;
  status: ClientStatus;
  joined_at: string;
}

export interface Subscription {
  id: string;
  client_id: string;
  sessions_per_month: number;
  period_start: string;
  period_end: string;
  extension_days: number;
  status: SubscriptionStatus;
}

export interface AvailabilitySlot {
  id: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  published: boolean;
  bookable_from: string | null;
}

export interface Booking {
  id: string;
  slot_id: string;
  client_id: string;
  status: BookingStatus;
  consumes_session: boolean;
  created_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

export interface Message {
  id: string;
  client_id: string;
  sender: 'coach' | 'client';
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Vacation {
  id: string;
  scope: VacationScope;
  client_id: string | null;
  start_date: string;
  end_date: string;
  extension_days: number;
}

export interface ManualOverride {
  id: string;
  coach_id: string;
  booking_id: string | null;
  client_id: string | null;
  action: OverrideAction;
  reason: string | null;
  created_at: string;
}

export interface SlotWithBooking extends AvailabilitySlot {
  booking: Booking | null;
  client_name: string | null;
}

export interface BookingWithDetails extends Booking {
  slot: AvailabilitySlot;
  client: Client;
}
