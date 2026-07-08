import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Log in — Pleiades",
  description: "Sign in or create a Pleiades account for journal, checkout, and X posting.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(147,197,253,0.12),transparent_45%),radial-gradient(ellipse_at_80%_80%,rgba(255,255,255,0.04),transparent_40%)]"
      />
      <main className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-28">
        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Pleiades
          </h1>
          <p className="mt-3 max-w-sm text-zinc-400">
            Log in or sign up to open your journal dashboard, checkout the pin,
            and connect X for public posts.
          </p>
        </header>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <AuthForm />
        </Suspense>
      </main>
    </div>
  );
}
