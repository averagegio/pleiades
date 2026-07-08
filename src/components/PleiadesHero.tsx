"use client";

import { useId, useMemo } from "react";
import {
  BUILD_SEQUENCE,
  getStarById,
  lineLength,
  stepDelay,
} from "@/lib/pleiades-stars";

type PleiadesHeroProps = {
  className?: string;
};

const SIZE = 400;

export function PleiadesHero({ className = "" }: PleiadesHeroProps) {
  const gradientId = useId();

  const { starDelays, lineDelays } = useMemo(() => {
    const starDelays = new Map<string, number>();
    const lineDelays = new Map<string, number>();

    BUILD_SEQUENCE.forEach((step, i) => {
      if (step.kind === "star") {
        starDelays.set(step.id, stepDelay(i));
      } else {
        lineDelays.set(`${step.from}-${step.to}`, stepDelay(i));
      }
    });

    return { starDelays, lineDelays };
  }, []);

  const lines = useMemo(
    () =>
      BUILD_SEQUENCE.filter((s) => s.kind === "line").map((step) => {
        if (step.kind !== "line") return null;
        const a = getStarById(step.from);
        const b = getStarById(step.to);
        if (!a || !b) return null;
        const len = lineLength(a, b, SIZE);
        return {
          key: `${step.from}-${step.to}`,
          a,
          b,
          len,
          delay: lineDelays.get(`${step.from}-${step.to}`) ?? 0,
        };
      }).filter(Boolean),
    [lineDelays],
  );

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full"
        aria-hidden="true"
        role="img"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147,197,253,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <rect width={SIZE} height={SIZE} fill={`url(#${gradientId})`} />

        {lines.map((edge) =>
          edge ? (
            <line
              key={edge.key}
              x1={edge.a.x * SIZE}
              y1={edge.a.y * SIZE}
              x2={edge.b.x * SIZE}
              y2={edge.b.y * SIZE}
              stroke="rgba(228,228,231,0.35)"
              strokeWidth="1"
              strokeDasharray={edge.len}
              strokeDashoffset={edge.len}
              className="constellation-line-draw"
              style={
                {
                  "--line-length": String(edge.len),
                  animationDelay: `${edge.delay}s`,
                } as React.CSSProperties
              }
            />
          ) : null,
        )}

        {BUILD_SEQUENCE.filter((s) => s.kind === "star").map((step) => {
          if (step.kind !== "star") return null;
          const star = getStarById(step.id);
          if (!star) return null;
          const delay = starDelays.get(star.id) ?? 0;

          return (
            <g key={star.id}>
              <circle
                cx={star.x * SIZE}
                cy={star.y * SIZE}
                r={star.radius * 2.5}
                fill="rgba(147,197,253,0.12)"
                className="constellation-glow opacity-0"
                style={
                  {
                    animationDelay: `${delay}s`,
                    "--target-opacity": String(star.brightness * 0.5),
                  } as React.CSSProperties
                }
              />
              <circle
                cx={star.x * SIZE}
                cy={star.y * SIZE}
                r={star.radius}
                fill="white"
                className="constellation-star opacity-0"
                style={
                  {
                    animationDelay: `${delay}s`,
                    "--target-opacity": String(star.brightness),
                  } as React.CSSProperties
                }
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
