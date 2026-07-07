"use client";

import { useState } from "react";

type Person = {
  id: number;
  name: string;
  note: string;
};

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  function addPerson(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setPeople((prev) => [
      { id: Date.now(), name: trimmed, note: note.trim() },
      ...prev,
    ]);
    setName("");
    setNote("");
  }

  function removePerson(id: number) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 py-16 px-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Pleiades
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            The people watching app — keep track of who you&apos;re watching.
          </p>
        </header>

        <form
          onSubmit={addPerson}
          className="flex flex-col gap-3 rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
        >
          <input
            aria-label="Person name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Who are you watching?"
            className="h-11 rounded-lg border border-black/[.1] px-3 text-base outline-none focus:border-black/[.3] dark:border-white/[.2] dark:bg-black dark:text-zinc-50"
          />
          <input
            aria-label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="h-11 rounded-lg border border-black/[.1] px-3 text-base outline-none focus:border-black/[.3] dark:border-white/[.2] dark:bg-black dark:text-zinc-50"
          />
          <button
            type="submit"
            className="h-11 rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add person
          </button>
        </form>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Watching ({people.length})
          </h2>
          {people.length === 0 ? (
            <p className="text-zinc-500">No one yet. Add someone above.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {people.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-black/[.08] bg-white px-4 py-3 dark:border-white/[.145] dark:bg-zinc-950"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-black dark:text-zinc-50">
                      {p.name}
                    </span>
                    {p.note && (
                      <span className="text-sm text-zinc-500">{p.note}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removePerson(p.id)}
                    className="text-sm text-zinc-500 hover:text-red-500"
                    aria-label={`Remove ${p.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
