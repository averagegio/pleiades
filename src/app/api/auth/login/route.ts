import { NextResponse } from "next/server";
import {
  AuthError,
  SESSION_COOKIE,
  cookieOptions,
  createSession,
  findUserByEmail,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";
    if (!email || !password) {
      throw new AuthError("Email and password required");
    }

    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
      throw new AuthError("Invalid email or password");
    }

    const session = await createSession(user.id);
    const res = NextResponse.json({ user: toPublicUser(user) });
    res.cookies.set(
      SESSION_COOKIE,
      session.token,
      cookieOptions(60 * 60 * 24 * 30),
    );
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    const status = err instanceof AuthError ? err.status : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
