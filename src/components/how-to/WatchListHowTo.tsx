import { MobileHowTo } from "@/components/MobileHowTo";
import type { HowToStep } from "@/components/how-to/types";

const steps: HowToStep[] = [
  {
    id: "scroll",
    title: "Scroll to your sky",
    body: "Swipe up from the intro to reach your watch list.",
    visual: (
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full border border-white/20" />
        <div className="scroll-chevron h-5 w-5 border-b border-r border-zinc-500" />
        <p className="text-xs text-zinc-600">Swipe up</p>
      </div>
    ),
  },
  {
    id: "orbit",
    title: "Pick a sister orbit",
    body: "Tap Electra for new sparks, or any sister for the right context.",
    visual: (
      <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden="true">
        <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,255,255,0.08)" />
        <circle cx="60" cy="48" r="5" fill="white" />
        <circle cx="78" cy="38" r="4" fill="rgba(255,255,255,0.9)" className="animate-pulse-slow" />
        <line x1="60" y1="48" x2="78" y2="38" stroke="rgba(147,197,253,0.5)" strokeWidth="1" />
        <text x="78" y="32" textAnchor="middle" fill="rgb(161,161,170)" fontSize="7">
          Electra
        </text>
      </svg>
    ),
  },
  {
    id: "add",
    title: "Add a star",
    body: "Nickname + optional note. Keep it private and low-pressure.",
    visual: (
      <div className="flex w-full max-w-[200px] flex-col gap-2">
        <div className="h-9 rounded-lg border border-white/15 px-3 text-left text-sm leading-9 text-zinc-300">
          Alex
        </div>
        <div className="h-9 rounded-lg border border-white/15 px-3 text-left text-xs leading-9 text-zinc-500">
          Met at the coffee shop
        </div>
        <div className="mt-1 h-8 rounded-full bg-zinc-200 text-center text-xs font-medium leading-8 text-black">
          Add star
        </div>
      </div>
    ),
  },
  {
    id: "connect",
    title: "See it connect",
    body: "Your star links into the constellation behind the list.",
    visual: (
      <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden="true">
        <line x1="60" y1="60" x2="40" y2="35" stroke="rgba(147,197,253,0.4)" strokeWidth="1" />
        <line x1="60" y1="60" x2="85" y2="45" stroke="rgba(147,197,253,0.4)" strokeWidth="1" />
        <circle cx="60" cy="60" r="5" fill="white" />
        <circle cx="40" cy="35" r="3.5" fill="rgba(255,255,255,0.8)" />
        <circle cx="85" cy="45" r="3.5" fill="rgba(255,255,255,0.8)" />
        <text x="60" y="95" textAnchor="middle" fill="rgb(161,161,170)" fontSize="8">
          Alex · Electra
        </text>
      </svg>
    ),
  },
];

export function WatchListHowTo() {
  return (
    <MobileHowTo
      title="How to add people"
      description="Tap through — under a minute, built for mobile."
      steps={steps}
      autoAdvanceMs={4000}
    />
  );
}
