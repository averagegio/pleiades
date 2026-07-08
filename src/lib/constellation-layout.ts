import type { WatchedStar } from "@/lib/watched-stars";
import { getOrbitById } from "@/lib/sister-orbits";

export type ConstellationNode = {
  id: string;
  x: number;
  y: number;
  brightness: number;
  isUser: boolean;
};

export type ConstellationEdge = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: "scroll" | "chain" | "hub";
  reveal: number;
};

const SIZE = 100;

/** Sister anchor points revealed as you scroll (percent coords). */
const SCROLL_ANCHORS = [
  { id: "scroll-alcyone", orbit: "alcyone" as const, x: 50, y: 42 },
  { id: "scroll-electra", orbit: "electra" as const, x: 68, y: 28 },
  { id: "scroll-maia", orbit: "maia" as const, x: 32, y: 58 },
  { id: "scroll-taygeta", orbit: "taygeta" as const, x: 18, y: 48 },
  { id: "scroll-merope", orbit: "merope" as const, x: 72, y: 62 },
  { id: "scroll-celaeno", orbit: "celaeno" as const, x: 38, y: 22 },
  { id: "scroll-sterope", orbit: "sterope" as const, x: 82, y: 44 },
];

export function userStarPosition(index: number): { x: number; y: number } {
  const angle = index * 2.399963;
  const radius = 12 + index * 5;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 48 + Math.sin(angle) * radius * 0.75,
  };
}

export function buildConstellation(
  stars: WatchedStar[],
  scrollProgress: number,
): { nodes: ConstellationNode[]; edges: ConstellationEdge[] } {
  const hub = { x: 50, y: 42 };
  const nodes: ConstellationNode[] = [];
  const edges: ConstellationEdge[] = [];

  SCROLL_ANCHORS.forEach((anchor, i) => {
    const threshold = (i + 1) / (SCROLL_ANCHORS.length + 1);
    const reveal = Math.min(1, Math.max(0, (scrollProgress - threshold * 0.5) / 0.35));
    if (reveal <= 0) return;

    const sister = getOrbitById(anchor.orbit);
    nodes.push({
      id: anchor.id,
      x: anchor.x,
      y: anchor.y,
      brightness: sister.id === "alcyone" ? 1 : 0.55,
      isUser: false,
    });

    edges.push({
      id: `scroll-${anchor.id}`,
      x1: hub.x,
      y1: hub.y,
      x2: anchor.x,
      y2: anchor.y,
      kind: "scroll",
      reveal,
    });
  });

  const userNodes = stars
    .filter((s) => s.orbit !== "celaeno")
    .slice()
    .reverse();

  userNodes.forEach((star, index) => {
    const pos = userStarPosition(index);
    nodes.push({
      id: `user-${star.id}`,
      x: pos.x,
      y: pos.y,
      brightness: star.brightness,
      isUser: true,
    });

    edges.push({
      id: `hub-${star.id}`,
      x1: hub.x,
      y1: hub.y,
      x2: pos.x,
      y2: pos.y,
      kind: "hub",
      reveal: 1,
    });

    if (index > 0) {
      const prev = userStarPosition(index - 1);
      edges.push({
        id: `chain-${star.id}`,
        x1: prev.x,
        y1: prev.y,
        x2: pos.x,
        y2: pos.y,
        kind: "chain",
        reveal: 1,
      });
    }
  });

  return { nodes, edges };
}

export function edgeLength(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  size = SIZE,
): number {
  const dx = ((x2 - x1) / 100) * size;
  const dy = ((y2 - y1) / 100) * size;
  return Math.hypot(dx, dy);
}
