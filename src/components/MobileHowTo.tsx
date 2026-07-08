"use client";

import { useCallback, useEffect, useState } from "react";
import type { HowToStep } from "@/components/how-to/types";

type MobileHowToProps = {
  title: string;
  description: string;
  steps: HowToStep[];
  /** Auto-advance interval in ms. Omit to disable. */
  autoAdvanceMs?: number;
};

export function MobileHowTo({
  title,
  description,
  steps,
  autoAdvanceMs = 4500,
}: MobileHowToProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + steps.length) % steps.length);
    },
    [index, steps.length],
  );

  useEffect(() => {
    if (!autoAdvanceMs) return;
    const timer = window.setInterval(() => go(index + 1), autoAdvanceMs);
    return () => clearInterval(timer);
  }, [autoAdvanceMs, go, index]);

  const step = steps[index];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium tracking-tight text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>

      <div className="mx-auto w-full max-w-[280px]">
        <div className="rounded-[2rem] border border-white/15 bg-zinc-950 p-3 shadow-2xl">
          <div className="mb-2 flex justify-center">
            <div className="h-1 w-16 rounded-full bg-white/10" />
          </div>

          <div
            key={step.id}
            className={`howto-panel flex min-h-[320px] flex-col overflow-hidden rounded-[1.4rem] bg-black px-4 py-6 ${
              direction === 1 ? "howto-slide-forward" : "howto-slide-back"
            }`}
          >
            <div className="flex flex-1 flex-col items-center justify-center">
              {step.visual}
            </div>
            <div className="mt-4 flex flex-col gap-2 text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                Step {index + 1} of {steps.length}
              </p>
              <h3 className="text-base font-medium text-zinc-50">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {step.body}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="rounded-full px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
              aria-label="Previous step"
            >
              Back
            </button>
            <div className="flex gap-1.5">
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-zinc-200" : "w-1.5 bg-zinc-700"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:text-white"
              aria-label="Next step"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
