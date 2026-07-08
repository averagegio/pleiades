"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";

export function AccountPanel() {
  const { user, loading, logout, refresh } = useAuth();
  const searchParams = useSearchParams();
  const xStatus = searchParams.get("x");
  const [configured, setConfigured] = useState(false);
  const [composer, setComposer] = useState("");
  const [postMsg, setPostMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/x/status", { cache: "no-store" });
      const data = (await res.json()) as { configured?: boolean };
      setConfigured(Boolean(data.configured));
      await refresh();
    })();
  }, [refresh, xStatus]);

  async function disconnectX() {
    await fetch("/api/x/status", { method: "DELETE" });
    await refresh();
  }

  async function postCustom(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setPostMsg(null);
    try {
      const res = await fetch("/api/x/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: composer }),
      });
      const data = (await res.json()) as {
        error?: string;
        mode?: string;
        message?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Post failed");
      setPostMsg(
        data.mode === "demo"
          ? data.message ?? "Demo post previewed."
          : "Posted to X.",
      );
      setComposer("");
    } catch (err) {
      setPostMsg(err instanceof Error ? err.message : "Post failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading account…</p>;
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-8 text-center">
        <p className="text-zinc-400">Sign in to manage X and account settings.</p>
        <Link
          href="/login?next=/account"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-zinc-50 px-6 text-sm font-medium text-black"
        >
          Log in / Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-xl border border-white/10 bg-zinc-950/60 p-6">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">
          Signed in
        </p>
        <h2 className="mt-2 text-xl font-semibold">{user.name}</h2>
        <p className="text-sm text-zinc-400">{user.email}</p>
        <button
          type="button"
          onClick={() => void logout().then(() => refresh())}
          className="mt-5 text-sm text-zinc-500 underline hover:text-zinc-300"
        >
          Sign out
        </button>
      </section>

      <section className="rounded-xl border border-white/10 bg-zinc-950/60 p-6">
        <h2 className="text-lg font-semibold">X (Twitter)</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Connect OAuth to publish public journal articles as posts.
        </p>

        {xStatus === "connected" && (
          <p className="mt-3 text-sm text-sky-300/90">X account connected.</p>
        )}
        {xStatus === "not_configured" && (
          <p className="mt-3 text-sm text-amber-300/90">
            Set X_CLIENT_ID / X_CLIENT_SECRET / X_CALLBACK_URL to enable live
            OAuth. Demo posting still works from the journal.
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {user.xConnected ? (
            <>
              <p className="text-sm text-zinc-300">
                Connected as @{user.xUsername ?? "unknown"}
              </p>
              <button
                type="button"
                onClick={() => void disconnectX()}
                className="rounded-full border border-white/15 px-4 py-2 text-xs hover:bg-white/5"
              >
                Disconnect
              </button>
            </>
          ) : configured ? (
            <a
              href="/api/x/connect"
              className="rounded-full bg-zinc-50 px-4 py-2 text-xs font-medium text-black hover:bg-zinc-300"
            >
              Connect X
            </a>
          ) : (
            <p className="text-sm text-zinc-500">
              Live OAuth not configured — journal &quot;Post to X&quot; uses
              demo mode until credentials are set.
            </p>
          )}
        </div>

        <form onSubmit={postCustom} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Quick post
            </span>
            <textarea
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              maxLength={280}
              rows={3}
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/25"
              placeholder="Say something to the public sky…"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !composer.trim()}
            className="h-10 rounded-full border border-white/15 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            {busy ? "Posting…" : "Post to X"}
          </button>
          {postMsg && <p className="text-xs text-zinc-400">{postMsg}</p>}
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-zinc-950/60 p-6">
        <h2 className="text-lg font-semibold">Shortcuts</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-400">
          <li>
            <Link href="/journal" className="underline hover:text-zinc-200">
              Journal dashboard
            </Link>
          </li>
          <li>
            <Link href="/pin#preorder" className="underline hover:text-zinc-200">
              Pin checkout
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
