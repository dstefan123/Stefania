/*
# Create avatars storage bucket for profile photos

1. Storage
- Create a public bucket `avatars` for coach and client profile photos.
- Files stored as `<user_id>/<filename>` or `coach/<filename>`.

2. Security (Storage RLS)
- Public read: anyone (anon + authenticated) can SELECT/READ files — photos are visible on the public website.
- Authenticated write: only the file owner can INSERT/UPDATE/DELETE their own folder.
- Coach can manage the `coach/` prefix folder.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for all files in avatars bucket
DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
CREATE POLICY "public_read_avatars" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

-- Authenticated users can upload to their own folder (user_id path prefix)
DROP POLICY IF EXISTS "auth_insert_avatars" ON storage.objects;
CREATE POLICY "auth_insert_avatars" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own files
DROP POLICY IF EXISTS "auth_update_avatars" ON storage.objects;
CREATE POLICY "auth_update_avatars" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own files
DROP POLICY IF EXISTS "auth_delete_avatars" ON storage.objects;
CREATE POLICY "auth_delete_avatars" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Coach can manage the coach/ folder
-- We need a separate set of policies that check if the user is a coach
-- and the path starts with 'coach'
DROP POLICY IF EXISTS "coach_insert_avatars" ON storage.objects;
CREATE POLICY "coach_insert_avatars" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = 'coach'
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_update_avatars" ON storage.objects;
CREATE POLICY "coach_update_avatars" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = 'coach'
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = 'coach'
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );

DROP POLICY IF EXISTS "coach_delete_avatars" ON storage.objects;
CREATE POLICY "coach_delete_avatars" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = 'coach'
    AND EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'coach')
  );
