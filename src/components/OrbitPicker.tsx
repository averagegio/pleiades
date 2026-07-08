"use client";

import {
  getOrbitById,
  SISTER_ORBITS,
  type SisterOrbitId,
} from "@/lib/sister-orbits";

type OrbitPickerProps = {
  value: SisterOrbitId;
  onChange: (orbit: SisterOrbitId) => void;
  disabled?: boolean;
};

const SIZE = 320;

export function OrbitPicker({ value, onChange, disabled = false }: OrbitPickerProps) {
  const selected = getOrbitById(value);

  return (
    <div className={`flex flex-col gap-4 ${disabled ? "opacity-80" : ""}`}>
      <div className="relative mx-auto aspect-square w-full max-w-[280px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          role="radiogroup"
          aria-label="Choose a sister orbit"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={SIZE * 0.38}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {SISTER_ORBITS.map((orbit) => {
            const cx = orbit.x * SIZE;
            const cy = orbit.y * SIZE;
            const isSelected = orbit.id === value;

            return (
              <g key={orbit.id}>
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={18}
                    fill="rgba(147,197,253,0.12)"
                    className="animate-pulse-slow"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 10 : 7}
                  fill={isSelected ? "white" : "rgba(228,228,231,0.5)"}
                  className="cursor-pointer transition-all hover:fill-white"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${orbit.name} — ${orbit.feature}`}
                  onClick={() => !disabled && onChange(orbit.id)}
                  style={{ cursor: disabled ? "default" : "pointer" }}
                />
                <text
                  x={cx}
                  y={cy - 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgb(113,113,122)"
                  className="pointer-events-none uppercase select-none"
                  style={{ letterSpacing: "0.08em" }}
                >
                  {orbit.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="px-4 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          {selected.name} · {selected.feature}
        </p>
        <p className="mt-1 text-sm text-zinc-300">{selected.tagline}</p>
      </div>
    </div>
  );
}
