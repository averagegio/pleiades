import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { PublicUser } from "@/lib/auth-types";
import { newId, readDb, updateDb } from "@/lib/db";
import type { SessionRecord, UserRecord } from "@/lib/types";

export type { PublicUser } from "@/lib/auth-types";

export const SESSION_COOKIE = "pleiades_session";
const SESSION_DAYS = 30;

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    xConnected: user.xConnected,
    xUsername: user.xUsername ?? null,
    createdAt: user.createdAt,
  };
}

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): boolean {
  const actual = hashPassword(password, salt);
  const a = Buffer.from(actual);
  const b = Buffer.from(expectedHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSalt(): string {
  return randomBytes(16).toString("hex");
}

function sessionExpiry(): string {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  return expires.toISOString();
}

export async function createSession(userId: string): Promise<SessionRecord> {
  const session: SessionRecord = {
    token: randomBytes(32).toString("hex"),
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: sessionExpiry(),
  };

  await updateDb((db) => {
    db.sessions = db.sessions.filter(
      (s) => s.userId !== userId && new Date(s.expiresAt) > new Date(),
    );
    db.sessions.push(session);
  });

  return session;
}

export async function destroySession(token: string): Promise<void> {
  await updateDb((db) => {
    db.sessions = db.sessions.filter((s) => s.token !== token);
  });
}

export async function getSessionUser(): Promise<UserRecord | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = await readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt) <= new Date()) {
    await destroySession(token);
    return null;
  }

  return db.users.find((u) => u.id === session.userId) ?? null;
}

export async function requireUser(): Promise<UserRecord> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthError("Sign in required");
  }
  return user;
}

export class AuthError extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const db = await readDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email === normalized) ?? null;
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<UserRecord> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !email.includes("@")) {
    throw new AuthError("Valid email required");
  }
  if (name.length < 1) {
    throw new AuthError("Name required");
  }
  if (input.password.length < 8) {
    throw new AuthError("Password must be at least 8 characters");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AuthError("An account with that email already exists");
  }

  const salt = createSalt();
  const user: UserRecord = {
    id: newId("user"),
    email,
    name,
    passwordHash: hashPassword(input.password, salt),
    salt,
    createdAt: new Date().toISOString(),
    xConnected: false,
  };

  await updateDb((db) => {
    db.users.push(user);
  });

  return user;
}

export function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
