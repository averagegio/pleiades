"use client";

import Image from "next/image";
import { useState } from "react";
import { MobileHowTo } from "@/components/MobileHowTo";
import { StarPinSchematic } from "@/components/StarPinSchematic";
import type { HowToStep } from "@/components/how-to/types";

function PinStepVisual({
  part,
  caption,
}: {
  part: "led" | "button" | "ble" | "clasp" | null;
  caption?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <StarPinSchematic activePart={part} className="w-full" />
      {caption && (
        <p className="text-center text-xs text-zinc-500">{caption}</p>
      )}
    </div>
  );
}

function PinHowToInner() {
  const steps: HowToStep[] = [
    {
      id: "tap",
      title: "Press once",
      body: "Someone catches your eye. Single tap on the side button.",
      visual: <PinStepVisual part="button" />,
    },
    {
      id: "led",
      title: "Star LED lights up",
      body: "The star-shaped LED confirms the spark — no screen needed.",
      visual: <PinStepVisual part="led" />,
    },
    {
      id: "sync",
      title: "Syncs over BLE",
      body: "Spark transfers to your phone when you're back in the app.",
      visual: <PinStepVisual part="ble" />,
    },
    {
      id: "name",
      title: "Name your star",
      body: "Opens in Electra orbit. Add a nickname when you're ready.",
      visual: (
        <div className="flex w-full max-w-[200px] flex-col items-center gap-2">
          <PinStepVisual part={null} />
          <div className="w-full rounded-lg border border-white/10 px-3 py-2 text-center text-xs text-zinc-400">
            New spark · Electra
          </div>
        </div>
      ),
    },
  ];

  return (
    <MobileHowTo
      title="How the pin works"
      description="Interactive schematic — tap through each part."
      steps={steps}
      autoAdvanceMs={4000}
    />
  );
}

export function PinHowTo() {
  return <PinHowToInner />;
}

const PART_DESCRIPTIONS = {
  led: "Star-shaped LED at center — confirms each spark",
  button: "Side tap button — single press to capture",
  ble: "BLE module — syncs when you're back in the app",
  clasp: "Butterfly clasp — stays on all day",
} as const;

/** Hero product photo for the pin page */
export function PinSchematicHero() {
  const [part, setPart] = useState<"led" | "button" | "ble" | "clasp">("led");
  const parts = ["led", "button", "ble", "clasp"] as const;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-2xl bg-black">
        <Image
          src="/images/pin/product-hero.png"
          alt="Pleiades Pin — circular brushed-metal disc with glowing star LED"
          width={1024}
          height={1024}
          className="h-auto w-full"
          priority
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {parts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPart(p)}
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              part === p
                ? "border-blue-300/50 text-blue-200"
                : "border-white/10 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {p === "led" ? "star led" : p}
          </button>
        ))}
      </div>
      <p className="max-w-xs text-center text-sm text-zinc-500">
        {PART_DESCRIPTIONS[part]}
      </p>
    </div>
  );
}
