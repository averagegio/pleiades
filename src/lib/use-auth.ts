"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { PublicUser } from "@/lib/auth-types";

type AuthSnapshot = {
  user: PublicUser | null;
  loading: boolean;
};

let snapshot: AuthSnapshot = { user: null, loading: true };
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot(): AuthSnapshot {
  return { user: null, loading: true };
}

async function fetchMe() {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    const data = (await res.json()) as { user: PublicUser | null };
    snapshot = { user: data.user, loading: false };
  } catch {
    snapshot = { user: null, loading: false };
  }
  emit();
}

function ensureAuthLoaded() {
  if (!fetchPromise) {
    fetchPromise = fetchMe().finally(() => {
      fetchPromise = null;
    });
  }
  return fetchPromise;
}

if (typeof window !== "undefined") {
  ensureAuthLoaded();
}

export function useAuth() {
  const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const refresh = useCallback(async () => {
    await fetchMe();
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    snapshot = { user: null, loading: false };
    emit();
  }, []);

  return { user: state.user, loading: state.loading, refresh, logout };
}
