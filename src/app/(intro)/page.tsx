"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PleiadesHero } from "@/components/PleiadesHero";

export default function IntroPage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const enter = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    window.setTimeout(() => router.push("/home"), 600);
  }, [exiting, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#050508] text-zinc-50 transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,95,0.25)_0%,transparent_70%)]" />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-10 px-6">
        <div className="h-64 w-64 sm:h-80 sm:w-80">
          <PleiadesHero className="h-full w-full" />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Pleiades
          </h1>
          <p className="max-w-xs text-sm text-zinc-400 sm:text-base">
            Seven sisters, one constellation — the people watching app.
          </p>
        </div>

        <button
          type="button"
          onClick={enter}
          className="group flex flex-col items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-medium backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
        >
          <span>Enter</span>
          <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
            Press Enter ↵
          </span>
        </button>
      </div>
    </div>
  );
}
