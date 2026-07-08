"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "signup";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/journal";
  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: mode === "signup" ? name : undefined,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex rounded-full border border-white/10 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${
            mode === "login"
              ? "bg-zinc-50 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-zinc-50 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border border-white/10 bg-transparent px-3 text-sm text-zinc-100 outline-none focus:border-white/25"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-zinc-600">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-transparent px-3 text-sm text-zinc-100 outline-none focus:border-white/25"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-zinc-600">
            Password
          </span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-transparent px-3 text-sm text-zinc-100 outline-none focus:border-white/25"
            placeholder="At least 8 characters"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </label>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 flex h-12 items-center justify-center rounded-full bg-zinc-50 text-sm font-medium text-black transition-colors hover:bg-zinc-300 disabled:opacity-60"
        >
          {busy
            ? "Working…"
            : mode === "login"
              ? "Enter the sky"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
