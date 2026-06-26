import { connectDB } from '@/lib/db';
import { fail, ok } from '@/lib/api';
import { hashPassword, publicUser, setSessionCookie } from '@/lib/auth';
import User from '@/models/User';
import Watchlist from '@/models/Watchlist';

export async function POST(req) {
  try {
    const { name, email, password, riskProfile = 'balanced' } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return fail('Name, email, and password are required.');
    }

    if (password.length < 8) {
      return fail('Password must be at least 8 characters long.');
    }

    await connectDB();

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      riskProfile,
    });

    await Watchlist.create({
      user: user._id,
      name: 'Primary Watchlist',
      items: [],
    });

    await setSessionCookie(user);

    return ok(
      {
        message: 'Account created.',
        user: publicUser(user),
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === 11000) {
      return fail('An account with this email already exists.', 409);
    }

    console.error('Registration error:', err);
    return fail('Internal Server Error.', 500);
  }
}
