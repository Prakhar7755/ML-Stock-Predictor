import { fail, ok } from '@/lib/api';
import { getCurrentUser, publicUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail('Not authenticated.', 401);

  return ok({ user: publicUser(user) });
}
