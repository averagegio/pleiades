"use client";

import { useMemo } from "react";
import {
  BUILD_SEQUENCE,
  getStarById,
  lineLength,
  stepDelay,
} from "@/lib/pleiades-stars";

type PleiadesHeroProps = {
  className?: string;
};

const SIZE = 520;

export function PleiadesHero({ className = "" }: PleiadesHeroProps) {
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
        {lines.map((edge) =>
          edge ? (
            <line
              key={edge.key}
              x1={edge.a.x * SIZE}
              y1={edge.a.y * SIZE}
              x2={edge.b.x * SIZE}
              y2={edge.b.y * SIZE}
              stroke="rgba(228,228,231,0.4)"
              strokeWidth="1.2"
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
            <circle
              key={star.id}
              cx={star.x * SIZE}
              cy={star.y * SIZE}
              r={star.radius * 1.15}
              fill="white"
              className="constellation-star opacity-0"
              style={
                {
                  animationDelay: `${delay}s`,
                  "--target-opacity": String(star.brightness),
                } as React.CSSProperties
              }
            />
          );
        })}
      </svg>
    </div>
  );
}
