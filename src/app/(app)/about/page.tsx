export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-black px-6 py-28 text-zinc-50">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="text-zinc-400 leading-relaxed">
          Pleiades is the people watching app — named for the seven sisters
          of Greek myth, drawn together as a constellation.
        </p>
      </main>
    </div>
  );
}
