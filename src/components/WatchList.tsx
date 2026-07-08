"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrbitPicker } from "@/components/OrbitPicker";
import {
  DEFAULT_ORBIT,
  getOrbitById,
  SISTER_ORBITS,
  type SisterOrbitId,
} from "@/lib/sister-orbits";
import {
  isVaultOrbit,
  useWatchedStars,
  type WatchedStar,
} from "@/lib/watched-stars";

type WatchListProps = {
  stars?: WatchedStar[];
  setStars?: (updater: (prev: WatchedStar[]) => WatchedStar[]) => void;
  onStarAdded?: (id: number) => void;
};

export function WatchList({
  stars: controlledStars,
  setStars: controlledSetStars,
  onStarAdded,
}: WatchListProps = {}) {
  const searchParams = useSearchParams();
  const orbitFilter = searchParams.get("orbit") as SisterOrbitId | null;
  const validFilter =
    orbitFilter && SISTER_ORBITS.some((o) => o.id === orbitFilter)
      ? orbitFilter
      : null;

  const [internalStars, internalSetStars] = useWatchedStars();
  const stars = controlledStars ?? internalStars;
  const setStars = controlledSetStars ?? internalSetStars;

  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [manualOrbit, setManualOrbit] = useState<SisterOrbitId>(DEFAULT_ORBIT);
  const [brightness, setBrightness] = useState(0.7);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const orbit = validFilter ?? manualOrbit;

  const addStar = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) return;

      const id = Date.now();
      setStars((prev) => [
        {
          id,
          name: trimmed,
          note: note.trim(),
          orbit,
          brightness: orbit === "alcyone" ? brightness : 0.5,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      onStarAdded?.(id);
      setName("");
      setNote("");
      setBrightness(0.7);
    },
    [name, note, orbit, brightness, setStars, onStarAdded],
  );

  function removeStar(id: number) {
    setStars((prev) => prev.filter((s) => s.id !== id));
    setRevealed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function toggleReveal(id: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = validFilter
    ? stars.filter((s) => s.orbit === validFilter)
    : stars.filter((s) => s.orbit !== "celaeno");

  const activeFilter = validFilter ? getOrbitById(validFilter) : null;

  return (
    <div className="relative z-10 flex flex-col flex-1 items-center bg-transparent font-sans text-zinc-50">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 px-6 py-16 pt-28">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {activeFilter ? `${activeFilter.name} · ${activeFilter.feature}` : "Watch list"}
          </h1>
          {activeFilter && (
            <p className="text-sm text-zinc-500">{activeFilter.description}</p>
          )}
          {!activeFilter && stars.length > 0 && (
            <p className="text-sm text-zinc-600">
              Scroll and add stars — watch connections form behind you.
            </p>
          )}
        </header>

        <form
          onSubmit={addStar}
          className="flex flex-col gap-4 rounded-xl border border-white/10 bg-zinc-950/90 p-4 backdrop-blur-sm"
        >
          <OrbitPicker
            value={orbit}
            onChange={setManualOrbit}
            disabled={!!validFilter}
          />

          {orbit === "sterope" && (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80">
              Public sky: only note public personas. No private addresses or
              doxxing.
            </p>
          )}

          <input
            aria-label="Star name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nickname or name"
            className="h-11 rounded-lg border border-white/10 bg-black px-3 text-base text-zinc-50 outline-none focus:border-white/25"
          />
          <input
            aria-label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your private note (optional)"
            className="h-11 rounded-lg border border-white/10 bg-black px-3 text-base text-zinc-50 outline-none focus:border-white/25"
          />

          {orbit === "alcyone" && (
            <label className="flex flex-col gap-2 text-sm text-zinc-400">
              Brightness
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.1}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="accent-zinc-50"
              />
            </label>
          )}

          <button
            type="submit"
            className="h-11 rounded-full bg-zinc-50 px-5 font-medium text-black transition-colors hover:bg-zinc-300"
          >
            Add star
          </button>
        </form>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Stars ({filtered.length})
          </h2>
          {filtered.length === 0 ? (
            <p className="text-zinc-600">
              No stars in this orbit yet. Pick a sister above and add one.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((star) => {
                const orbitMeta = getOrbitById(star.orbit);
                const vault = isVaultOrbit(star.orbit);
                const hidden = vault && !revealed.has(star.id);

                return (
                  <li
                    key={star.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-zinc-950/90 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{
                            opacity: star.orbit === "alcyone" ? star.brightness : 1,
                          }}
                        >
                          {hidden ? "••••••" : star.name}
                        </span>
                        <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500">
                          {orbitMeta.name}
                        </span>
                      </div>
                      {star.note && (
                        <span className={`text-sm text-zinc-500 ${hidden ? "blur-sm select-none" : ""}`}>
                          {hidden ? "Hidden note" : star.note}
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {vault && (
                        <button
                          onClick={() => toggleReveal(star.id)}
                          className="text-sm text-zinc-500 hover:text-zinc-300"
                          aria-label={hidden ? "Reveal star" : "Hide star"}
                        >
                          {hidden ? "Show" : "Hide"}
                        </button>
                      )}
                      <button
                        onClick={() => removeStar(star.id)}
                        className="text-sm text-zinc-500 hover:text-red-400"
                        aria-label={`Remove ${star.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
