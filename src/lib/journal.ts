import type { SisterOrbitId } from "@/lib/sister-orbits";
import { SISTER_ORBIT_IDS } from "@/lib/sister-orbits";
import { newId, readDb, updateDb } from "@/lib/db";
import type { JournalEntry } from "@/lib/types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function listJournalsForUser(
  userId: string,
): Promise<JournalEntry[]> {
  const db = await readDb();
  return db.journals
    .filter((j) => j.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getJournalForUser(
  userId: string,
  id: string,
): Promise<JournalEntry | null> {
  const db = await readDb();
  return db.journals.find((j) => j.id === id && j.userId === userId) ?? null;
}

export async function getPublicJournalBySlug(
  slug: string,
): Promise<JournalEntry | null> {
  const db = await readDb();
  return (
    db.journals.find((j) => j.isPublic && j.slug === slug && j.publishedAt) ??
    null
  );
}

export async function listPublicJournals(): Promise<JournalEntry[]> {
  const db = await readDb();
  return db.journals
    .filter((j) => j.isPublic && j.publishedAt && j.slug)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function createJournal(input: {
  userId: string;
  title: string;
  body: string;
  orbit: SisterOrbitId;
}): Promise<JournalEntry> {
  const title = input.title.trim();
  const body = input.body.trim();
  if (!title) throw new Error("Title required");
  if (!body) throw new Error("Body required");
  if (!SISTER_ORBIT_IDS.includes(input.orbit)) {
    throw new Error("Invalid orbit");
  }

  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: newId("journal"),
    userId: input.userId,
    title,
    body,
    orbit: input.orbit,
    isPublic: false,
    slug: null,
    metaTitle: null,
    metaDescription: null,
    keywords: [],
    seoScore: null,
    seoNotes: [],
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await updateDb((db) => {
    db.journals.push(entry);
  });

  return entry;
}

export async function updateJournal(
  userId: string,
  id: string,
  patch: Partial<
    Pick<
      JournalEntry,
      | "title"
      | "body"
      | "orbit"
      | "isPublic"
      | "slug"
      | "metaTitle"
      | "metaDescription"
      | "keywords"
      | "seoScore"
      | "seoNotes"
      | "publishedAt"
    >
  >,
): Promise<JournalEntry> {
  let updated: JournalEntry | null = null;

  await updateDb((db) => {
    const idx = db.journals.findIndex((j) => j.id === id && j.userId === userId);
    if (idx < 0) throw new Error("Journal not found");
    const current = db.journals[idx];
    updated = {
      ...current,
      title: patch.title?.trim() ?? current.title,
      body: patch.body?.trim() ?? current.body,
      orbit: patch.orbit ?? current.orbit,
      isPublic: patch.isPublic ?? current.isPublic,
      slug: patch.slug !== undefined ? patch.slug : current.slug,
      metaTitle:
        patch.metaTitle !== undefined ? patch.metaTitle : current.metaTitle,
      metaDescription:
        patch.metaDescription !== undefined
          ? patch.metaDescription
          : current.metaDescription,
      keywords: patch.keywords ?? current.keywords,
      seoScore: patch.seoScore !== undefined ? patch.seoScore : current.seoScore,
      seoNotes: patch.seoNotes ?? current.seoNotes,
      publishedAt:
        patch.publishedAt !== undefined
          ? patch.publishedAt
          : current.publishedAt,
      updatedAt: new Date().toISOString(),
    };
    db.journals[idx] = updated;
  });

  if (!updated) throw new Error("Journal not found");
  return updated;
}

export async function deleteJournal(
  userId: string,
  id: string,
): Promise<void> {
  await updateDb((db) => {
    db.journals = db.journals.filter(
      (j) => !(j.id === id && j.userId === userId),
    );
  });
}

export function journalStats(entries: JournalEntry[]) {
  const byOrbit: Record<string, number> = {};
  let publicCount = 0;
  let draftCount = 0;
  let avgSeo = 0;
  let seoCounted = 0;

  for (const entry of entries) {
    byOrbit[entry.orbit] = (byOrbit[entry.orbit] ?? 0) + 1;
    if (entry.isPublic) publicCount += 1;
    else draftCount += 1;
    if (typeof entry.seoScore === "number") {
      avgSeo += entry.seoScore;
      seoCounted += 1;
    }
  }

  return {
    total: entries.length,
    publicCount,
    draftCount,
    byOrbit,
    avgSeoScore: seoCounted ? Math.round(avgSeo / seoCounted) : null,
  };
}
