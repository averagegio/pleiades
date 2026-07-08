"use client";

import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";
import { SISTER_ORBITS, type SisterOrbitId } from "@/lib/sister-orbits";
import { useAuth } from "@/lib/use-auth";
import type { JournalEntry } from "@/lib/types";

type Stats = {
  total: number;
  publicCount: number;
  draftCount: number;
  byOrbit: Record<string, number>;
  avgSeoScore: number | null;
};

type JournalSnapshot = {
  entries: JournalEntry[];
  stats: Stats | null;
  loading: boolean;
  userId: string | null;
};

let journalSnapshot: JournalSnapshot = {
  entries: [],
  stats: null,
  loading: false,
  userId: null,
};
let journalPromise: Promise<void> | null = null;
const journalListeners = new Set<() => void>();

function emitJournal() {
  for (const listener of journalListeners) listener();
}

function subscribeJournal(listener: () => void) {
  journalListeners.add(listener);
  return () => journalListeners.delete(listener);
}

function getJournalSnapshot() {
  return journalSnapshot;
}

async function fetchJournals(userId: string) {
  try {
    const res = await fetch("/api/journal", { cache: "no-store" });
    if (!res.ok) {
      journalSnapshot = {
        entries: [],
        stats: null,
        loading: false,
        userId,
      };
    } else {
      const data = (await res.json()) as {
        entries: JournalEntry[];
        stats: Stats;
      };
      journalSnapshot = {
        entries: data.entries,
        stats: data.stats,
        loading: false,
        userId,
      };
    }
  } catch {
    journalSnapshot = {
      entries: [],
      stats: null,
      loading: false,
      userId,
    };
  }
  emitJournal();
}

function requestJournals(userId: string | null) {
  if (!userId) {
    if (journalSnapshot.userId !== null) {
      journalSnapshot = {
        entries: [],
        stats: null,
        loading: false,
        userId: null,
      };
      queueMicrotask(emitJournal);
    }
    return;
  }
  if (journalSnapshot.userId === userId || journalPromise) return;
  journalSnapshot = { ...journalSnapshot, loading: true, userId };
  queueMicrotask(emitJournal);
  journalPromise = fetchJournals(userId).finally(() => {
    journalPromise = null;
  });
}

export function JournalDashboard() {
  const { user, loading: authLoading } = useAuth();
  requestJournals(user?.id ?? null);
  const journal = useSyncExternalStore(
    subscribeJournal,
    getJournalSnapshot,
    getJournalSnapshot,
  );

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [orbit, setOrbit] = useState<SisterOrbitId>("electra");
  const [busy, setBusy] = useState(false);
  const [seoBusyId, setSeoBusyId] = useState<string | null>(null);
  const [postBusyId, setPostBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    journalPromise = fetchJournals(user.id).finally(() => {
      journalPromise = null;
    });
    await journalPromise;
  }, [user]);

  async function createEntry(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, orbit }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not create entry");
      setTitle("");
      setBody("");
      setMessage("Journal entry saved.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function runSeo(id: string, publish = true) {
    setSeoBusyId(id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/seo-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalId: id, publish }),
      });
      const data = (await res.json()) as {
        error?: string;
        publicPath?: string | null;
        seo?: { seoScore: number; iterations: number };
      };
      if (!res.ok) throw new Error(data.error ?? "SEO agent failed");
      setMessage(
        `SEO loop finished (score ${data.seo?.seoScore ?? "—"}${
          data.publicPath ? `) · live at ${data.publicPath}` : ")"
        }`,
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "SEO failed");
    } finally {
      setSeoBusyId(null);
    }
  }

  async function postToX(id: string) {
    setPostBusyId(id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/x/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalId: id }),
      });
      const data = (await res.json()) as {
        error?: string;
        mode?: string;
        tweet?: { text: string };
        message?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "X post failed");
      setMessage(
        data.mode === "demo"
          ? data.message ?? "Demo X post previewed."
          : "Posted to X.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "X post failed");
    } finally {
      setPostBusyId(null);
    }
  }

  async function removeEntry(id: string) {
    await fetch(`/api/journal?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    await reload();
  }

  if (authLoading) {
    return (
      <p className="text-sm text-zinc-500" aria-live="polite">
        Loading journal…
      </p>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-8 text-center">
        <h2 className="text-xl font-semibold">Sign in to open your journal</h2>
        <p className="mt-2 text-sm text-zinc-400">
          The dashboard keeps drafts private until you run the SEO loop and make
          an article public.
        </p>
        <Link
          href="/login?next=/journal"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-50 px-6 text-sm font-medium text-black hover:bg-zinc-300"
        >
          Log in / Sign up
        </Link>
      </div>
    );
  }

  const { entries, stats } = journal;

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Entries" value={String(stats?.total ?? 0)} />
        <StatCard label="Public" value={String(stats?.publicCount ?? 0)} />
        <StatCard label="Drafts" value={String(stats?.draftCount ?? 0)} />
        <StatCard
          label="Avg SEO"
          value={stats?.avgSeoScore != null ? String(stats.avgSeoScore) : "—"}
        />
      </section>

      {(message || error) && (
        <p
          className={`text-sm ${error ? "text-red-400" : "text-sky-300/90"}`}
          role="status"
        >
          {error ?? message}
        </p>
      )}

      <section className="rounded-xl border border-white/10 bg-zinc-950/60 p-6">
        <h2 className="text-lg font-semibold">New journal entry</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Private by default. Make public only after the SEO agent loop.
        </p>
        <form onSubmit={createEntry} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Title
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-transparent px-3 text-sm outline-none focus:border-white/25"
              placeholder="A note worth watching"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Body
            </span>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/25"
              placeholder="Write the observation…"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Orbit
            </span>
            <select
              value={orbit}
              onChange={(e) => setOrbit(e.target.value as SisterOrbitId)}
              className="h-11 rounded-lg border border-white/10 bg-black px-3 text-sm outline-none focus:border-white/25"
            >
              {SISTER_ORBITS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} — {o.feature}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-full bg-zinc-50 text-sm font-medium text-black hover:bg-zinc-300 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save entry"}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold">Your sky</h2>
          <Link
            href="/account"
            className="text-xs text-zinc-500 underline hover:text-zinc-300"
          >
            Connect X
          </Link>
        </div>

        {journal.loading && entries.length === 0 ? (
          <p className="text-sm text-zinc-500">Loading entries…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-zinc-500">No entries yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-xl border border-white/10 bg-zinc-950/40 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                      {entry.orbit}
                      {entry.isPublic ? " · public" : " · private"}
                      {entry.seoScore != null ? ` · SEO ${entry.seoScore}` : ""}
                    </p>
                    <h3 className="mt-1 text-base font-medium">{entry.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="text-xs text-zinc-600 hover:text-zinc-300"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                  {entry.body}
                </p>
                {entry.seoNotes.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1">
                    {entry.seoNotes.slice(0, 3).map((note) => (
                      <li key={note} className="text-xs text-zinc-600">
                        · {note}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={seoBusyId === entry.id}
                    onClick={() => runSeo(entry.id, true)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50"
                  >
                    {seoBusyId === entry.id
                      ? "Running SEO…"
                      : "Make public + SEO loop"}
                  </button>
                  {entry.isPublic && entry.slug && (
                    <>
                      <Link
                        href={`/articles/${entry.slug}`}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/5"
                      >
                        View article
                      </Link>
                      <button
                        type="button"
                        disabled={postBusyId === entry.id}
                        onClick={() => postToX(entry.id)}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50"
                      >
                        {postBusyId === entry.id ? "Posting…" : "Post to X"}
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950/50 px-4 py-4">
      <p className="text-[10px] uppercase tracking-widest text-zinc-600">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
