import { NextResponse } from "next/server";
import {
  AuthError,
  SESSION_COOKIE,
  cookieOptions,
  createSession,
  createUser,
  toPublicUser,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      password?: string;
    };

    const user = await createUser({
      email: body.email ?? "",
      name: body.name ?? "",
      password: body.password ?? "",
    });
    const session = await createSession(user.id);

    const res = NextResponse.json({ user: toPublicUser(user) });
    res.cookies.set(
      SESSION_COOKIE,
      session.token,
      cookieOptions(60 * 60 * 24 * 30),
    );
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    const status = err instanceof AuthError ? err.status : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
