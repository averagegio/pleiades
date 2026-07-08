import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getSessionUser } from "@/lib/auth";
import {
  createCodeChallenge,
  createCodeVerifier,
  getXAuthUrl,
  xConfigured,
} from "@/lib/x-api";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!xConfigured()) {
    return NextResponse.json(
      {
        error:
          "X API is not configured. Set X_CLIENT_ID, X_CLIENT_SECRET, and X_CALLBACK_URL.",
        configured: false,
      },
      { status: 503 },
    );
  }

  const state = randomBytes(16).toString("hex");
  const verifier = createCodeVerifier();
  const challenge = await createCodeChallenge(verifier);

  const res = NextResponse.redirect(getXAuthUrl(state, challenge));
  res.cookies.set("x_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  res.cookies.set("x_code_verifier", verifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
