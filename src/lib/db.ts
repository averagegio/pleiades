import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { promises as fs } from "fs";
import path from "path";
import type {
  DbShape,
  JournalEntry,
  OrderRecord,
  SessionRecord,
  UserRecord,
} from "@/lib/types";
import type { SisterOrbitId } from "@/lib/sister-orbits";

export type {
  DbShape,
  JournalEntry,
  OrderRecord,
  SessionRecord,
  UserRecord,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), ".data");

const EMPTY_DB: DbShape = {
  users: [],
  sessions: [],
  journals: [],
  orders: [],
};

let schemaReady: Promise<void> | null = null;
let sqlClient: NeonQueryFunction<false, false> | null = null;

export function databaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    undefined
  );
}

export function usingNeon(): boolean {
  return Boolean(databaseUrl());
}

function getSql() {
  const url = databaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!sqlClient) {
    sqlClient = neon(url);
  }
  return sqlClient;
}

async function ensureSchema(): Promise<void> {
  if (!usingNeon()) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          x_connected BOOLEAN NOT NULL DEFAULT FALSE,
          x_access_token TEXT,
          x_refresh_token TEXT,
          x_user_id TEXT,
          x_username TEXT
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS journals (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          orbit TEXT NOT NULL,
          is_public BOOLEAN NOT NULL DEFAULT FALSE,
          slug TEXT,
          meta_title TEXT,
          meta_description TEXT,
          keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
          seo_score INTEGER,
          seo_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
          published_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `;
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS journals_slug_unique
        ON journals (slug)
        WHERE slug IS NOT NULL
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
          email TEXT NOT NULL,
          product TEXT NOT NULL,
          amount_cents INTEGER NOT NULL,
          status TEXT NOT NULL,
          stripe_session_id TEXT,
          created_at TIMESTAMPTZ NOT NULL
        )
      `;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
    salt: String(row.salt),
    createdAt: new Date(String(row.created_at)).toISOString(),
    xConnected: Boolean(row.x_connected),
    xAccessToken: row.x_access_token ? String(row.x_access_token) : undefined,
    xRefreshToken: row.x_refresh_token
      ? String(row.x_refresh_token)
      : undefined,
    xUserId: row.x_user_id ? String(row.x_user_id) : undefined,
    xUsername: row.x_username ? String(row.x_username) : undefined,
  };
}

function mapSession(row: Record<string, unknown>): SessionRecord {
  return {
    token: String(row.token),
    userId: String(row.user_id),
    createdAt: new Date(String(row.created_at)).toISOString(),
    expiresAt: new Date(String(row.expires_at)).toISOString(),
  };
}

function mapJournal(row: Record<string, unknown>): JournalEntry {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    title: String(row.title),
    body: String(row.body),
    orbit: String(row.orbit) as SisterOrbitId,
    isPublic: Boolean(row.is_public),
    slug: row.slug == null ? null : String(row.slug),
    metaTitle: row.meta_title == null ? null : String(row.meta_title),
    metaDescription:
      row.meta_description == null ? null : String(row.meta_description),
    keywords: asStringArray(row.keywords),
    seoScore: row.seo_score == null ? null : Number(row.seo_score),
    seoNotes: asStringArray(row.seo_notes),
    publishedAt:
      row.published_at == null
        ? null
        : new Date(String(row.published_at)).toISOString(),
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

function mapOrder(row: Record<string, unknown>): OrderRecord {
  return {
    id: String(row.id),
    userId: row.user_id == null ? null : String(row.user_id),
    email: String(row.email),
    product: "pleiades-pin",
    amountCents: Number(row.amount_cents),
    status: String(row.status) as OrderRecord["status"],
    stripeSessionId:
      row.stripe_session_id == null ? null : String(row.stripe_session_id),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function dbPath(): string {
  return path.join(DATA_DIR, "store.json");
}

async function readFileDb(): Promise<DbShape> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(dbPath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
      journals: parsed.journals ?? [],
      orders: parsed.orders ?? [],
    };
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

async function writeFileDb(db: DbShape): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(dbPath(), JSON.stringify(db, null, 2), "utf8");
}

async function readNeonDb(): Promise<DbShape> {
  await ensureSchema();
  const sql = getSql();
  const [users, sessions, journals, orders] = await Promise.all([
    sql`SELECT * FROM users`,
    sql`SELECT * FROM sessions`,
    sql`SELECT * FROM journals`,
    sql`SELECT * FROM orders`,
  ]);
  return {
    users: users.map((row) => mapUser(row as Record<string, unknown>)),
    sessions: sessions.map((row) => mapSession(row as Record<string, unknown>)),
    journals: journals.map((row) => mapJournal(row as Record<string, unknown>)),
    orders: orders.map((row) => mapOrder(row as Record<string, unknown>)),
  };
}

async function writeNeonDb(db: DbShape): Promise<void> {
  await ensureSchema();
  const sql = getSql();

  await sql`DELETE FROM sessions`;
  await sql`DELETE FROM journals`;
  await sql`DELETE FROM orders`;
  await sql`DELETE FROM users`;

  for (const user of db.users) {
    await sql`
      INSERT INTO users (
        id, email, name, password_hash, salt, created_at,
        x_connected, x_access_token, x_refresh_token, x_user_id, x_username
      ) VALUES (
        ${user.id},
        ${user.email},
        ${user.name},
        ${user.passwordHash},
        ${user.salt},
        ${user.createdAt},
        ${user.xConnected},
        ${user.xAccessToken ?? null},
        ${user.xRefreshToken ?? null},
        ${user.xUserId ?? null},
        ${user.xUsername ?? null}
      )
    `;
  }

  for (const session of db.sessions) {
    await sql`
      INSERT INTO sessions (token, user_id, created_at, expires_at)
      VALUES (
        ${session.token},
        ${session.userId},
        ${session.createdAt},
        ${session.expiresAt}
      )
    `;
  }

  for (const journal of db.journals) {
    await sql`
      INSERT INTO journals (
        id, user_id, title, body, orbit, is_public, slug,
        meta_title, meta_description, keywords, seo_score, seo_notes,
        published_at, created_at, updated_at
      ) VALUES (
        ${journal.id},
        ${journal.userId},
        ${journal.title},
        ${journal.body},
        ${journal.orbit},
        ${journal.isPublic},
        ${journal.slug},
        ${journal.metaTitle},
        ${journal.metaDescription},
        ${JSON.stringify(journal.keywords)},
        ${journal.seoScore},
        ${JSON.stringify(journal.seoNotes)},
        ${journal.publishedAt},
        ${journal.createdAt},
        ${journal.updatedAt}
      )
    `;
  }

  for (const order of db.orders) {
    await sql`
      INSERT INTO orders (
        id, user_id, email, product, amount_cents, status,
        stripe_session_id, created_at
      ) VALUES (
        ${order.id},
        ${order.userId},
        ${order.email},
        ${order.product},
        ${order.amountCents},
        ${order.status},
        ${order.stripeSessionId},
        ${order.createdAt}
      )
    `;
  }
}

export async function readDb(): Promise<DbShape> {
  if (usingNeon()) return readNeonDb();
  return readFileDb();
}

export async function writeDb(db: DbShape): Promise<void> {
  if (usingNeon()) {
    await writeNeonDb(db);
    return;
  }
  await writeFileDb(db);
}

export async function updateDb(
  mutator: (db: DbShape) => void | Promise<void>,
): Promise<DbShape> {
  const db = await readDb();
  await mutator(db);
  await writeDb(db);
  return db;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function pingDatabase(): Promise<{
  mode: "neon" | "file";
  ok: boolean;
}> {
  if (!usingNeon()) {
    await ensureDataDir();
    return { mode: "file", ok: true };
  }
  await ensureSchema();
  const sql = getSql();
  await sql`SELECT 1`;
  return { mode: "neon", ok: true };
}
