/*
# Fix: CREATE POLICY IF EXISTS typo

The previous migration had "CREATE POLICY IF EXISTS" instead of "DROP POLICY IF EXISTS" 
for the client_select_published_slots policy. This migration applies the corrected version 
of the entire schema.
*/

-- ============================================================
-- USERS TABLE (app-level, mirrors auth.users with role)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('coach', 'client')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_user" ON users;
CREATE POLICY "select_own_user" ON users FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_user" ON users;
CREATE POLICY "update_own_user" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "coach_select_all_users" ON users;
CREATE POLICY "coach_select_all_users" ON users FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  avatar text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "coach_select_all_profiles" ON profiles;
CREATE POLICY "coach_select_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

-- ============================================================
-- COACH_PROFILE TABLE (single row, public read)
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Stefania Moraru',
  bio text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  specialties text[] DEFAULT '{}',
  photo text,
  location text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT ''
);

ALTER TABLE coach_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_coach_profile" ON coach_profile;
CREATE POLICY "public_select_coach_profile" ON coach_profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "coach_update_coach_profile" ON coach_profile;
CREATE POLICY "coach_update_coach_profile" ON coach_profile FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_coach_profile" ON coach_profile;
CREATE POLICY "coach_insert_coach_profile" ON coach_profile FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

-- ============================================================
-- CLIENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  goal text,
  notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  joined_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_clients" ON clients;
CREATE POLICY "coach_select_clients" ON clients FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_clients" ON clients;
CREATE POLICY "coach_insert_clients" ON clients FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_clients" ON clients;
CREATE POLICY "coach_update_clients" ON clients FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_clients" ON clients;
CREATE POLICY "coach_delete_clients" ON clients FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_own" ON clients;
CREATE POLICY "client_select_own" ON clients FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "client_update_own" ON clients;
CREATE POLICY "client_update_own" ON clients FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sessions_per_month integer NOT NULL DEFAULT 10 CHECK (sessions_per_month >= 1 AND sessions_per_month <= 30),
  period_start date NOT NULL DEFAULT CURRENT_DATE,
  period_end date NOT NULL,
  extension_days integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired', 'suspended')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_subscriptions" ON subscriptions;
CREATE POLICY "coach_select_subscriptions" ON subscriptions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_subscriptions" ON subscriptions;
CREATE POLICY "coach_insert_subscriptions" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_subscriptions" ON subscriptions;
CREATE POLICY "coach_update_subscriptions" ON subscriptions FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_subscriptions" ON subscriptions;
CREATE POLICY "coach_delete_subscriptions" ON subscriptions FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_own_subscriptions" ON subscriptions;
CREATE POLICY "client_select_own_subscriptions" ON subscriptions FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = subscriptions.client_id AND c.user_id = auth.uid())
  );

-- ============================================================
-- AVAILABILITY_SLOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  location text,
  published boolean NOT NULL DEFAULT false,
  bookable_from timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slots_starts_at ON availability_slots(starts_at);
CREATE INDEX IF NOT EXISTS idx_slots_published ON availability_slots(published);

ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_slots" ON availability_slots;
CREATE POLICY "coach_select_slots" ON availability_slots FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_slots" ON availability_slots;
CREATE POLICY "coach_insert_slots" ON availability_slots FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_slots" ON availability_slots;
CREATE POLICY "coach_update_slots" ON availability_slots FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_slots" ON availability_slots;
CREATE POLICY "coach_delete_slots" ON availability_slots FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_published_slots" ON availability_slots;
CREATE POLICY "client_select_published_slots" ON availability_slots FOR SELECT
  TO authenticated USING (published = true);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES availability_slots(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  consumes_session boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  cancelled_at timestamptz,
  cancellation_reason text
);

CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_bookings" ON bookings;
CREATE POLICY "coach_select_bookings" ON bookings FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_bookings" ON bookings;
CREATE POLICY "coach_insert_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_bookings" ON bookings;
CREATE POLICY "coach_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_bookings" ON bookings;
CREATE POLICY "coach_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_own_bookings" ON bookings;
CREATE POLICY "client_select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = bookings.client_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "client_insert_own_bookings" ON bookings;
CREATE POLICY "client_insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = bookings.client_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "client_update_own_bookings" ON bookings;
CREATE POLICY "client_update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = bookings.client_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = bookings.client_id AND c.user_id = auth.uid())
  );

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('coach', 'client')),
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_client ON messages(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_messages" ON messages;
CREATE POLICY "coach_select_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_messages" ON messages;
CREATE POLICY "coach_insert_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_messages" ON messages;
CREATE POLICY "coach_update_messages" ON messages FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_own_messages" ON messages;
CREATE POLICY "client_select_own_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = messages.client_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "client_insert_own_messages" ON messages;
CREATE POLICY "client_insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = messages.client_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "client_update_own_messages" ON messages;
CREATE POLICY "client_update_own_messages" ON messages FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = messages.client_id AND c.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM clients c WHERE c.id = messages.client_id AND c.user_id = auth.uid())
  );

-- ============================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_announcements" ON announcements;
CREATE POLICY "coach_select_announcements" ON announcements FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_announcements" ON announcements;
CREATE POLICY "coach_insert_announcements" ON announcements FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_announcements" ON announcements;
CREATE POLICY "coach_update_announcements" ON announcements FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_announcements" ON announcements;
CREATE POLICY "coach_delete_announcements" ON announcements FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_published_announcements" ON announcements;
CREATE POLICY "client_select_published_announcements" ON announcements FOR SELECT
  TO authenticated USING (published = true);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('booking_confirmed', 'booking_cancelled', 'booking_reminder', 'message', 'announcement', 'subscription', 'system')),
  title text NOT NULL,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "coach_insert_notifications" ON notifications;
CREATE POLICY "coach_insert_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

-- ============================================================
-- VACATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope text NOT NULL CHECK (scope IN ('coach', 'client')),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  extension_days integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vacations_client ON vacations(client_id);
CREATE INDEX IF NOT EXISTS idx_vacations_scope ON vacations(scope);

ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_vacations" ON vacations;
CREATE POLICY "coach_select_vacations" ON vacations FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_vacations" ON vacations;
CREATE POLICY "coach_insert_vacations" ON vacations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_vacations" ON vacations;
CREATE POLICY "coach_update_vacations" ON vacations FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_vacations" ON vacations;
CREATE POLICY "coach_delete_vacations" ON vacations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "client_select_own_vacations" ON vacations;
CREATE POLICY "client_select_own_vacations" ON vacations FOR SELECT
  TO authenticated USING (
    scope = 'coach' OR (
      client_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM clients c WHERE c.id = vacations.client_id AND c.user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- MANUAL_OVERRIDES TABLE (audit log, coach only)
-- ============================================================
CREATE TABLE IF NOT EXISTS manual_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('return_session', 'cancel_booking', 'move_booking', 'mark_no_show', 'change_session_count', 'change_subscription_period', 'create_slot', 'manual_booking')),
  reason text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_overrides_coach ON manual_overrides(coach_id);
CREATE INDEX IF NOT EXISTS idx_overrides_client ON manual_overrides(client_id);

ALTER TABLE manual_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_select_overrides" ON manual_overrides;
CREATE POLICY "coach_select_overrides" ON manual_overrides FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_insert_overrides" ON manual_overrides;
CREATE POLICY "coach_insert_overrides" ON manual_overrides FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

-- ============================================================
-- TRIGGER: Auto-create profile on user insert
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name)
  VALUES (NEW.id, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED: Coach profile
-- ============================================================
INSERT INTO coach_profile (name, bio, tagline, specialties, location, email, phone, instagram)
VALUES (
  'Stefania Moraru',
  'Antrenor personal certificat cu peste 8 ani de experiență în transformarea corpului și a minții. Specializată în antrenament de forță, recompoziție corporală și mobilitate. Filosofia mea este simplă: rezultate sustenabile prin planuri personalizate, disciplină și consecvență.',
  'Antrenament personal. Rezultate reale.',
  ARRAY['Personal Training', 'Antrenament de forță', 'Slăbire și recompoziție', 'Mobilitate și postură', 'Pregătire fizică generală'],
  'București, România',
  'contact@stefaniamoraru.ro',
  '+40 700 000 000',
  '@stefaniamoraru'
)
ON CONFLICT DO NOTHING;