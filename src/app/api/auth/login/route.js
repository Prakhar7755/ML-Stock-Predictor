import { connectDB } from "@/lib/db";
import { fail, ok } from "@/lib/api";
import { publicUser, setSessionCookie, verifyPassword } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return fail("Email and password are required.");
    }

    await connectDB();

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return fail("Invalid email or password.", 401);
    }

    await setSessionCookie(user);

    return ok({
      message: "Logged in.",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    return fail("Internal Server Error.", 500);
  }
}
