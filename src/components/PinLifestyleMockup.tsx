"use client";

import { useState } from "react";

type WearMode = "shirt" | "bag";

/** Star pin badge — reusable on fabric mockups */
function StarPinBadge({
  x,
  y,
  scale = 1,
  glowing = false,
}: {
  x: number;
  y: number;
  scale?: number;
  glowing?: boolean;
}) {
  const s = scale;
  const cx = x;
  const cy = y;

  return (
    <g transform={`translate(${cx}, ${cy}) scale(${s})`}>
      {glowing && (
        <circle cx="0" cy="-2" r="22" fill="rgba(147,197,253,0.12)" />
      )}
      {/* Shadow on fabric */}
      <ellipse cx="2" cy="8" rx="18" ry="6" fill="rgba(0,0,0,0.35)" />
      {/* Pin post */}
      <rect x="-1" y="12" width="2" height="10" fill="#6b7280" rx="0.5" />
      {/* Star body — brushed metal */}
      <defs>
        <linearGradient id="pinMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8ea" />
          <stop offset="45%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#52525b" />
        </linearGradient>
        <linearGradient id="pinEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fafafa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3f3f46" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <polygon
        points="0,-20 6,-6 20,-6 9,2 14,18 0,10 -14,18 -9,2 -20,-6 -6,-6"
        fill="url(#pinMetal)"
        stroke="url(#pinEdge)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Center LED */}
      <circle
        cx="0"
        cy="-2"
        r="3.5"
        fill={glowing ? "#93c5fd" : "#f4f4f5"}
        className={glowing ? "animate-twinkle" : ""}
      />
      {glowing && (
        <circle cx="0" cy="-2" r="6" fill="rgba(147,197,253,0.25)" />
      )}
      {/* Tap button lower point */}
      <circle cx="0" cy="14" r="4" fill="#71717a" stroke="#a1a1aa" strokeWidth="0.5" />
      <circle cx="0" cy="14" r="1.8" fill="#d4d4d8" />
    </g>
  );
}

function ShirtMockup({ glowing }: { glowing: boolean }) {
  return (
    <svg
      viewBox="0 0 400 420"
      className="h-full w-full"
      aria-label="Pleiades pin on shirt lapel"
      role="img"
    >
      <defs>
        <linearGradient id="jacketFabric" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1c1c1f" />
          <stop offset="50%" stopColor="#0a0a0b" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id="lapelFold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>

      {/* Jacket torso */}
      <path
        d="M 40 80 L 200 40 L 360 80 L 360 400 L 40 400 Z"
        fill="url(#jacketFabric)"
      />
      {/* Lapels */}
      <path
        d="M 200 40 L 130 200 L 95 400 L 40 400 L 40 80 Z"
        fill="url(#lapelFold)"
        opacity="0.95"
      />
      <path
        d="M 200 40 L 270 200 L 305 400 L 360 400 L 360 80 Z"
        fill="url(#lapelFold)"
        opacity="0.85"
      />
      {/* Collar */}
      <path
        d="M 160 55 L 200 40 L 240 55 L 220 100 L 180 100 Z"
        fill="#27272a"
        stroke="#3f3f46"
        strokeWidth="0.5"
      />
      {/* Stitch line */}
      <path
        d="M 130 200 Q 165 220 200 230"
        fill="none"
        stroke="#3f3f46"
        strokeWidth="0.5"
        strokeDasharray="3 2"
        opacity="0.5"
      />
      {/* Pin on left lapel */}
      <StarPinBadge x={168} y={175} scale={1.15} glowing={glowing} />
      <text x="200" y="395" textAnchor="middle" fill="#52525b" fontSize="11">
        Left lapel · everyday carry
      </text>
    </svg>
  );
}

function BagMockup({ glowing }: { glowing: boolean }) {
  return (
    <svg
      viewBox="0 0 400 420"
      className="h-full w-full"
      aria-label="Pleiades pin on tote bag strap"
      role="img"
    >
      <defs>
        <linearGradient id="canvasFabric" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d6d3d1" />
          <stop offset="100%" stopColor="#a8a29e" />
        </linearGradient>
        <linearGradient id="strapFabric" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="50%" stopColor="#a8a29e" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>
      </defs>

      {/* Bag body */}
      <rect x="70" y="140" width="260" height="250" rx="8" fill="url(#canvasFabric)" />
      <rect
        x="70"
        y="140"
        width="260"
        height="250"
        rx="8"
        fill="none"
        stroke="#78716c"
        strokeWidth="1"
      />
      {/* Strap */}
      <path
        d="M 120 140 L 120 60 Q 200 20 280 60 L 280 140"
        fill="none"
        stroke="url(#strapFabric)"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <path
        d="M 120 140 L 120 60 Q 200 20 280 60 L 280 140"
        fill="none"
        stroke="#57534e"
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Fabric crease */}
      <line
        x1="200"
        y1="160"
        x2="200"
        y2="370"
        stroke="#78716c"
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* Pin on strap */}
      <StarPinBadge x={200} y={108} scale={1.1} glowing={glowing} />
      <text x="200" y="405" textAnchor="middle" fill="#57534e" fontSize="11">
        Strap · always within reach
      </text>
    </svg>
  );
}

export function PinLifestyleMockup({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<WearMode>("shirt");
  const [glowing, setGlowing] = useState(true);

  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-300">Wear it</p>
        <div className="flex rounded-full border border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => setMode("shirt")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "shirt"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Shirt
          </button>
          <button
            type="button"
            onClick={() => setMode("bag")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "bag"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Bag
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        <div className="aspect-[4/4.2] w-full transition-opacity duration-300">
          {mode === "shirt" ? (
            <ShirtMockup glowing={glowing} />
          ) : (
            <BagMockup glowing={glowing} />
          )}
        </div>
        <button
          type="button"
          onClick={() => setGlowing((g) => !g)}
          className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-wider text-zinc-400 backdrop-blur-sm transition-colors hover:text-zinc-200"
        >
          {glowing ? "LED on" : "LED off"}
        </button>
      </div>
      <p className="text-center text-xs text-zinc-600">
        Star pin on {mode === "shirt" ? "a jacket lapel" : "a bag strap"} — tap
        to preview the LED.
      </p>
    </section>
  );
}
