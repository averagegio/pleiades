import { promises as fs } from "fs";
import path from "path";
import type { DbShape } from "@/lib/types";

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

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function dbPath(): string {
  return path.join(DATA_DIR, "store.json");
}

export async function readDb(): Promise<DbShape> {
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

export async function writeDb(db: DbShape): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(dbPath(), JSON.stringify(db, null, 2), "utf8");
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
