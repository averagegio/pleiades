"use client";

import { useState } from "react";

type Person = {
  id: number;
  name: string;
  note: string;
};

export function WatchList() {
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
    <div className="flex flex-col flex-1 items-center bg-black font-sans text-zinc-50">
      <main className="flex flex-1 w-full max-w-2xl flex-col gap-8 px-6 py-16 pt-28">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Watch list</h1>
        </header>

        <form
          onSubmit={addPerson}
          className="flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-950 p-4"
        >
          <input
            aria-label="Person name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Who are you watching?"
            className="h-11 rounded-lg border border-white/10 bg-black px-3 text-base text-zinc-50 outline-none focus:border-white/25"
          />
          <input
            aria-label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="h-11 rounded-lg border border-white/10 bg-black px-3 text-base text-zinc-50 outline-none focus:border-white/25"
          />
          <button
            type="submit"
            className="h-11 rounded-full bg-zinc-50 px-5 font-medium text-black transition-colors hover:bg-zinc-300"
          >
            Add person
          </button>
        </form>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Watching ({people.length})
          </h2>
          {people.length === 0 ? (
            <p className="text-zinc-600">No one yet. Add someone above.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {people.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-zinc-950 px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    {p.note && (
                      <span className="text-sm text-zinc-500">{p.note}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removePerson(p.id)}
                    className="text-sm text-zinc-500 hover:text-red-400"
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
