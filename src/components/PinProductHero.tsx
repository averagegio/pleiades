"use client";

import Image from "next/image";
import { useState } from "react";

export type PinPart = "led" | "button" | "ble" | "clasp";

const PARTS: PinPart[] = ["led", "button", "ble", "clasp"];

const PART_LABELS: Record<PinPart, string> = {
  led: "star led",
  button: "button",
  ble: "ble",
  clasp: "clasp",
};

const PART_DESCRIPTIONS: Record<PinPart, string> = {
  led: "Star-shaped LED at center — confirms each spark",
  button: "Side tap button — single press to capture",
  ble: "BLE module — syncs when you're back in the app",
  clasp: "Butterfly clasp — stays on all day",
};

/** Percentage positions mapped to the product-hero.png pin disc */
const HOTSPOTS: Record<
  PinPart,
  {
    cx: number;
    cy: number;
    r: number;
    label: string;
    labelX: number;
    labelY: number;
  }
> = {
  led: {
    cx: 50,
    cy: 41.5,
    r: 6,
    label: "Star LED",
    labelX: 50,
    labelY: 28,
  },
  button: {
    cx: 50,
    cy: 56.5,
    r: 3.8,
    label: "Tap",
    labelX: 50,
    labelY: 67,
  },
  ble: {
    cx: 57.5,
    cy: 46,
    r: 4.5,
    label: "BLE",
    labelX: 72,
    labelY: 52,
  },
  clasp: {
    cx: 66.5,
    cy: 43,
    r: 3.5,
    label: "Clasp",
    labelX: 80,
    labelY: 36,
  },
};

function HotspotOverlay({
  activePart,
  onSelect,
}: {
  activePart: PinPart;
  onSelect: (part: PinPart) => void;
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      viewBox="0 0 100 100"
      aria-hidden
    >
      {PARTS.map((part) => {
        const spot = HOTSPOTS[part];
        const isActive = part === activePart;

        return (
          <g key={part}>
            <circle
              cx={spot.cx}
              cy={spot.cy}
              r={spot.r + 4}
              fill="transparent"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onSelect(part)}
            />

            {isActive && (
              <>
                <circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={spot.r + 2.8}
                  fill="none"
                  stroke="rgba(147,197,253,0.35)"
                  strokeWidth="0.55"
                  className="animate-pulse-slow"
                />
                <circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={spot.r}
                  fill="none"
                  stroke="rgb(147,197,253)"
                  strokeWidth="0.65"
                />
                {part === "led" && (
                  <>
                    <circle
                      cx={spot.cx}
                      cy={spot.cy}
                      r={spot.r + 1.2}
                      fill="none"
                      stroke="rgba(255,255,255,0.85)"
                      strokeWidth="0.5"
                    />
                    <path
                      d={`M ${spot.cx} ${spot.cy - spot.r - 4} L ${spot.cx} ${spot.cy - spot.r - 1.2} M ${spot.cx} ${spot.cy + spot.r + 1.2} L ${spot.cx} ${spot.cy + spot.r + 4} M ${spot.cx - spot.r - 4} ${spot.cy} L ${spot.cx - spot.r - 1.2} ${spot.cy} M ${spot.cx + spot.r + 1.2} ${spot.cy} L ${spot.cx + spot.r + 4} ${spot.cy}`}
                      stroke="rgba(191,219,254,0.9)"
                      strokeWidth="0.45"
                      strokeLinecap="round"
                    />
                  </>
                )}

                <line
                  x1={spot.cx}
                  y1={spot.cy}
                  x2={spot.labelX}
                  y2={spot.labelY + (spot.labelY > spot.cy ? -2.5 : 2.5)}
                  stroke="rgba(147,197,253,0.55)"
                  strokeWidth="0.35"
                  strokeDasharray="1.2 1"
                />
                <rect
                  x={spot.labelX - 7}
                  y={spot.labelY - 3.2}
                  width="14"
                  height="4.8"
                  rx="2.4"
                  fill="rgba(0,0,0,0.72)"
                  stroke="rgba(147,197,253,0.45)"
                  strokeWidth="0.25"
                />
                <text
                  x={spot.labelX}
                  y={spot.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgb(191,219,254)"
                  fontSize="2.6"
                  fontWeight="500"
                >
                  {spot.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {activePart === "ble" && (
        <rect
          x={53.5}
          y={43}
          width="8"
          height="5.5"
          rx="1"
          fill="none"
          stroke="rgba(147,197,253,0.4)"
          strokeWidth="0.35"
          strokeDasharray="0.8 0.6"
        />
      )}
    </svg>
  );
}

export function PinProductHero() {
  const [part, setPart] = useState<PinPart>("led");

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
        <HotspotOverlay activePart={part} onSelect={setPart} />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {PARTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPart(p)}
            aria-pressed={part === p}
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              part === p
                ? "border-blue-300/50 bg-blue-300/10 text-blue-200"
                : "border-white/10 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {PART_LABELS[p]}
          </button>
        ))}
      </div>

      <p className="max-w-xs text-center text-sm text-zinc-500">
        {PART_DESCRIPTIONS[part]}
      </p>
    </div>
  );
}
