import Link from "next/link";

type LegalLayoutProps = {
  title: string;
  updated: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-dvh bg-black px-6 py-28 text-zinc-300">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
        >
          ← Pleiades
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-zinc-50">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">Last updated: {updated}</p>
        <div className="prose-legal mt-10 flex flex-col gap-6 text-sm leading-relaxed">
          {children}
        </div>
      </main>
    </div>
  );
}
