"use client";

import { useMemo } from "react";
import {
  buildConstellation,
  edgeLength,
} from "@/lib/constellation-layout";
import type { WatchedStar } from "@/lib/watched-stars";

type ConstellationBackgroundProps = {
  scrollProgress: number;
  stars: WatchedStar[];
  highlightId?: number | null;
};

const SIZE = 100;

export function ConstellationBackground({
  scrollProgress,
  stars,
  highlightId,
}: ConstellationBackgroundProps) {
  const { nodes, edges } = useMemo(
    () => buildConstellation(stars, scrollProgress),
    [stars, scrollProgress],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-70"
      >
        <defs>
          <radialGradient id="bg-glow" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stopColor="rgba(147,197,253,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width={SIZE} height={SIZE} fill="url(#bg-glow)" />

        {edges.map((edge) => {
          const len = edgeLength(edge.x1, edge.y1, edge.x2, edge.y2, SIZE);
          const isNew =
            highlightId != null &&
            (edge.id === `hub-${highlightId}` || edge.id === `chain-${highlightId}`);

          return (
            <line
              key={edge.id}
              x1={(edge.x1 / 100) * SIZE}
              y1={(edge.y1 / 100) * SIZE}
              x2={(edge.x2 / 100) * SIZE}
              y2={(edge.y2 / 100) * SIZE}
              stroke={
                edge.kind === "chain"
                  ? "rgba(228,228,231,0.35)"
                  : "rgba(147,197,253,0.25)"
              }
              strokeWidth={edge.kind === "chain" ? 0.15 : 0.12}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - edge.reveal)}
              className={isNew ? "constellation-link-new" : "constellation-link"}
              style={
                {
                  "--line-length": String(len),
                  opacity: edge.reveal,
                } as React.CSSProperties
              }
            />
          );
        })}

        {nodes.map((node) => {
          const isHighlight =
            highlightId != null && node.id === `user-${highlightId}`;
          const r = node.isUser ? 0.55 : 0.4;

          return (
            <g key={node.id}>
              {isHighlight && (
                <circle
                  cx={(node.x / 100) * SIZE}
                  cy={(node.y / 100) * SIZE}
                  r={r * 2.2}
                  fill="rgba(147,197,253,0.15)"
                  className="animate-pulse-slow"
                />
              )}
              <circle
                cx={(node.x / 100) * SIZE}
                cy={(node.y / 100) * SIZE}
                r={r}
                fill={node.isUser ? "white" : "rgba(228,228,231,0.7)"}
                opacity={node.brightness}
                className={isHighlight ? "constellation-node-new" : undefined}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
