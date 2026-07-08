import { JournalDashboard } from "@/components/JournalDashboard";

export const metadata = {
  title: "Journal — Pleiades",
  description:
    "Private journal dashboard with public SEO publishing and X posting.",
};

export default function JournalPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(147,197,253,0.1),transparent_40%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%)]"
      />
      <main className="relative mx-auto max-w-3xl px-6 py-28">
        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Journal
          </h1>
          <p className="mt-3 max-w-xl text-zinc-400">
            Draft privately, run the SEO agent loop when you want clicks, then
            share public articles to X.
          </p>
        </header>
        <JournalDashboard />
      </main>
    </div>
  );
}
