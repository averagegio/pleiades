import { Suspense } from "react";
import { AccountPanel } from "@/components/AccountPanel";

export const metadata = {
  title: "Account — Pleiades",
  description: "Manage your Pleiades account and X connection.",
};

export default function AccountPage() {
  return (
    <div className="min-h-dvh bg-black text-zinc-50">
      <main className="mx-auto max-w-xl px-6 py-28">
        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-3 text-zinc-400">
            Session, X posting, and links into journal and checkout.
          </p>
        </header>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <AccountPanel />
        </Suspense>
      </main>
    </div>
  );
}
