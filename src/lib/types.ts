import type { SisterOrbitId } from "@/lib/sister-orbits";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  xConnected: boolean;
  xAccessToken?: string;
  xRefreshToken?: string;
  xUserId?: string;
  xUsername?: string;
};

export type SessionRecord = {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type JournalEntry = {
  id: string;
  userId: string;
  title: string;
  body: string;
  orbit: SisterOrbitId;
  isPublic: boolean;
  slug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  seoScore: number | null;
  seoNotes: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderRecord = {
  id: string;
  userId: string | null;
  email: string;
  product: "pleiades-pin";
  amountCents: number;
  status: "pending" | "paid" | "demo";
  stripeSessionId: string | null;
  createdAt: string;
};

export type DbShape = {
  users: UserRecord[];
  sessions: SessionRecord[];
  journals: JournalEntry[];
  orders: OrderRecord[];
};
