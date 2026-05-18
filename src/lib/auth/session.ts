import { createClient } from '@supabase/supabase-js';
import type { UserRole } from '@/types/auth';
import type { UserProfile } from '@/types/auth';

interface SessionResult {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Verify the bearer token from an API request and return user info
 * including their role from the profiles table.
 */
export async function getServerSession(
  authHeader: string | null,
): Promise<SessionResult | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;

  // Fetch the profile to get the role
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role: UserRole = (profile as UserProfile | null)?.role ?? 'customer';

  return { userId: user.id, email: user.email ?? '', role };
}
