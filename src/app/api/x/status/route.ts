import { NextResponse } from "next/server";
import { getSessionUser, toPublicUser } from "@/lib/auth";
import { clearXConnection, xConfigured } from "@/lib/x-api";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    configured: xConfigured(),
    connected: Boolean(user?.xConnected),
    username: user?.xUsername ?? null,
    user: user ? toPublicUser(user) : null,
  });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  await clearXConnection(user.id);
  return NextResponse.json({ ok: true, connected: false });
}
