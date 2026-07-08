import { createHash, randomBytes } from "crypto";
import { updateDb } from "@/lib/db";
import type { UserRecord } from "@/lib/types";

const X_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const X_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const X_TWEET_URL = "https://api.twitter.com/2/tweets";
const X_ME_URL = "https://api.twitter.com/2/users/me";

export function xConfigured(): boolean {
  return Boolean(
    process.env.X_CLIENT_ID &&
      process.env.X_CLIENT_SECRET &&
      process.env.X_CALLBACK_URL,
  );
}

export function getXAuthUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: process.env.X_CALLBACK_URL!,
    scope: "tweet.read tweet.write users.read offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${X_AUTH_URL}?${params.toString()}`;
}

export async function exchangeXCode(input: {
  code: string;
  codeVerifier: string;
}): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}> {
  const basic = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`,
  ).toString("base64");

  const body = new URLSearchParams({
    code: input.code,
    grant_type: "authorization_code",
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: process.env.X_CALLBACK_URL!,
    code_verifier: input.codeVerifier,
  });

  const res = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`X token exchange failed: ${text}`);
  }

  return (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };
}

export async function fetchXProfile(accessToken: string): Promise<{
  id: string;
  username: string;
}> {
  const res = await fetch(X_ME_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error("Failed to load X profile");
  }
  const data = (await res.json()) as {
    data?: { id: string; username: string };
  };
  if (!data.data) throw new Error("X profile missing");
  return data.data;
}

export async function postTweet(
  accessToken: string,
  text: string,
): Promise<{ id: string; text: string }> {
  const res = await fetch(X_TWEET_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`X post failed: ${err}`);
  }

  const data = (await res.json()) as {
    data?: { id: string; text: string };
  };
  if (!data.data) throw new Error("X post response missing data");
  return data.data;
}

export async function saveXConnection(
  userId: string,
  tokens: {
    accessToken: string;
    refreshToken?: string;
    xUserId: string;
    xUsername: string;
  },
): Promise<UserRecord> {
  let user: UserRecord | null = null;
  await updateDb((db) => {
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error("User not found");
    db.users[idx] = {
      ...db.users[idx],
      xConnected: true,
      xAccessToken: tokens.accessToken,
      xRefreshToken: tokens.refreshToken,
      xUserId: tokens.xUserId,
      xUsername: tokens.xUsername,
    };
    user = db.users[idx];
  });
  if (!user) throw new Error("User not found");
  return user;
}

export async function clearXConnection(userId: string): Promise<void> {
  await updateDb((db) => {
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx < 0) return;
    db.users[idx] = {
      ...db.users[idx],
      xConnected: false,
      xAccessToken: undefined,
      xRefreshToken: undefined,
      xUserId: undefined,
      xUsername: undefined,
    };
  });
}

export function composeJournalTweet(input: {
  title: string;
  excerpt: string;
  url: string;
}): string {
  const max = 280;
  const suffix = `\n\n${input.url}`;
  const budget = max - suffix.length;
  let body = `${input.title}\n\n${input.excerpt}`.trim();
  if (body.length > budget) {
    body = `${body.slice(0, Math.max(0, budget - 1))}…`;
  }
  return `${body}${suffix}`;
}

/** PKCE helpers */
export function createCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export async function createCodeChallenge(verifier: string): Promise<string> {
  return createHash("sha256").update(verifier).digest("base64url");
}
