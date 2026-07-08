import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth";
import {
  exchangeXCode,
  fetchXProfile,
  saveXConnection,
  xConfigured,
} from "@/lib/x-api";

export async function GET(request: Request) {
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  ).replace(/\/$/, "");

  if (!xConfigured()) {
    return NextResponse.redirect(`${origin}/account?x=not_configured`);
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?next=/account`);
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const jar = await cookies();
  const expectedState = jar.get("x_oauth_state")?.value;
  const verifier = jar.get("x_code_verifier")?.value;

  if (!code || !state || !expectedState || state !== expectedState || !verifier) {
    return NextResponse.redirect(`${origin}/account?x=denied`);
  }

  try {
    const tokens = await exchangeXCode({ code, codeVerifier: verifier });
    const profile = await fetchXProfile(tokens.access_token);
    await saveXConnection(user.id, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      xUserId: profile.id,
      xUsername: profile.username,
    });

    const res = NextResponse.redirect(`${origin}/account?x=connected`);
    res.cookies.set("x_oauth_state", "", { maxAge: 0, path: "/" });
    res.cookies.set("x_code_verifier", "", { maxAge: 0, path: "/" });
    return res;
  } catch {
    return NextResponse.redirect(`${origin}/account?x=error`);
  }
}
