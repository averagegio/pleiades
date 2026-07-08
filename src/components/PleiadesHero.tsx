"use client";

import { useId, useMemo } from "react";
import {
  getStarById,
  PLEIADES_EDGES,
  PLEIADES_STARS,
} from "@/lib/pleiades-stars";

type PleiadesHeroProps = {
  className?: string;
};

export function PleiadesHero({ className = "" }: PleiadesHeroProps) {
  const gradientId = useId();

  const edges = useMemo(
    () =>
      PLEIADES_EDGES.map(([from, to], i) => {
        const a = getStarById(from);
        const b = getStarById(to);
        if (!a || !b) return null;
        return { key: `${from}-${to}`, a, b, delay: 0.8 + i * 0.08 };
      }).filter(Boolean),
    [],
  );

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        aria-hidden="true"
        role="img"
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(147,197,253,0.35)" />
            <stop offset="100%" stopColor="rgba(10,10,10,0)" />
          </radialGradient>
        </defs>

        <rect width="400" height="400" fill={`url(#${gradientId})`} />

        {edges.map((edge) =>
          edge ? (
            <line
              key={edge.key}
              x1={edge.a.x * 400}
              y1={edge.a.y * 400}
              x2={edge.b.x * 400}
              y2={edge.b.y * 400}
              stroke="rgba(228,228,231,0.25)"
              strokeWidth="1"
              className="constellation-line opacity-0 motion-reduce:opacity-60"
              style={{ animationDelay: `${edge.delay}s` }}
            />
          ) : null,
        )}

        {PLEIADES_STARS.map((star, i) => (
          <g key={star.id}>
            <circle
              cx={star.x * 400}
              cy={star.y * 400}
              r={star.radius * 2.5}
              fill="rgba(147,197,253,0.12)"
              className="constellation-glow opacity-0 motion-reduce:opacity-40"
              style={
                {
                  animationDelay: `${i * 0.1}s`,
                  "--target-opacity": String(star.brightness * 0.5),
                } as React.CSSProperties
              }
            />
            <circle
              cx={star.x * 400}
              cy={star.y * 400}
              r={star.radius}
              fill="white"
              className="constellation-star opacity-0 motion-reduce:opacity-100"
              style={
                {
                  animationDelay: `${i * 0.1}s`,
                  "--target-opacity": String(star.brightness),
                } as React.CSSProperties
              }
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
