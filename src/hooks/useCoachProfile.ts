import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { CoachProfile } from '@/types';

export function useCoachProfile() {
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('coach_profile')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data as CoachProfile | null);
        setLoading(false);
      });
  }, []);

  return { profile, loading };
}
