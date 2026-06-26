import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export function ok(payload = {}, init = {}) {
  return NextResponse.json({ success: true, ...payload }, init);
}

export function fail(message, status = 400, payload = {}) {
  return NextResponse.json(
    { success: false, message, ...payload },
    { status },
  );
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: fail("You must be logged in to use this service.", 401),
    };
  }

  return { user, response: null };
}
