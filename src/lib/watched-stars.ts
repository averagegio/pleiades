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

function getSnapshot(): WatchedStar[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchedStar[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
  window.dispatchEvent(new Event(STAR_EVENT));
}

function saveStars(stars: WatchedStar[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stars));
  emitChange();
}

export function useWatchedStars() {
  const stars = useSyncExternalStore(subscribe, getSnapshot, () => []);

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
