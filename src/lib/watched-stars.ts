import { useCallback, useSyncExternalStore } from "react";
import type { SisterOrbitId } from "@/lib/sister-orbits";

export type WatchedStar = {
  id: number;
  name: string;
  note: string;
  orbit: SisterOrbitId;
  brightness: number;
  createdAt: string;
};

const STORAGE_KEY = "pleiades-stars";
const STAR_EVENT = "pleiades-stars-change";
const EMPTY: WatchedStar[] = [];

let cachedRaw: string | null | undefined;
let cachedSnapshot: WatchedStar[] = EMPTY;

function invalidateCache(): void {
  cachedRaw = undefined;
}

function getSnapshot(): WatchedStar[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;

    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = EMPTY;
      return cachedSnapshot;
    }

    const parsed = JSON.parse(raw) as WatchedStar[];
    cachedSnapshot = Array.isArray(parsed) ? parsed : EMPTY;
    return cachedSnapshot;
  } catch {
    cachedSnapshot = EMPTY;
    return cachedSnapshot;
  }
}

function getServerSnapshot(): WatchedStar[] {
  return EMPTY;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(STAR_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STAR_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function emitChange(): void {
  invalidateCache();
  window.dispatchEvent(new Event(STAR_EVENT));
}

function saveStars(stars: WatchedStar[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stars));
  emitChange();
}

export function useWatchedStars() {
  const stars = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setStars = useCallback(
    (updater: (prev: WatchedStar[]) => WatchedStar[]) => {
      saveStars(updater(getSnapshot()));
    },
    [],
  );

  return [stars, setStars] as const;
}

export function isVaultOrbit(orbit: SisterOrbitId): boolean {
  return orbit === "merope";
}
