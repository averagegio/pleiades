"use client";

import { useState } from "react";
import { useAuth } from "@/lib/use-auth";

type CheckoutButtonProps = {
  className?: string;
};

export function CheckoutButton({ className }: CheckoutButtonProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || user?.email }),
      });
      const data = (await res.json()) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={startCheckout} className="flex flex-col gap-3">
      {!user && (
        <label className="flex flex-col gap-1.5 text-left">
          <span className="text-xs uppercase tracking-widest text-zinc-600">
            Email for order
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 rounded-lg border border-white/10 bg-transparent px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-white/25"
          />
        </label>
      )}
      <button
        type="submit"
        id="preorder"
        disabled={busy}
        className={
          className ??
          "flex h-12 items-center justify-center rounded-full bg-zinc-50 text-sm font-medium text-black transition-colors hover:bg-zinc-300 disabled:opacity-60"
        }
      >
        {busy ? "Starting checkout…" : "Checkout — $49"}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
      <p className="text-center text-xs text-zinc-600">
        {user
          ? `Charging to ${user.email}`
          : "Stripe when configured · demo checkout otherwise"}
      </p>
    </form>
  );
}
