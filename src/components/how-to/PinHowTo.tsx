"use client";

import { MobileHowTo } from "@/components/MobileHowTo";
import { PinProductHero } from "@/components/PinProductHero";
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

/** Hero product photo with interactive part hotspots */
export function PinSchematicHero() {
  return <PinProductHero />;
}
