export type Star = {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  brightness: number;
};

export type BuildStep =
  | { kind: "star"; id: string }
  | { kind: "line"; from: string; to: string };

/** Normalized 0–1 positions approximating the Pleiades cluster. */
export const PLEIADES_STARS: Star[] = [
  { id: "alcyone", name: "Alcyone", x: 0.5, y: 0.48, radius: 5, brightness: 1 },
  { id: "atlas", name: "Atlas", x: 0.38, y: 0.42, radius: 3.5, brightness: 0.75 },
  { id: "electra", name: "Electra", x: 0.62, y: 0.38, radius: 3.5, brightness: 0.8 },
  { id: "maia", name: "Maia", x: 0.44, y: 0.58, radius: 3.2, brightness: 0.7 },
  { id: "merope", name: "Merope", x: 0.58, y: 0.55, radius: 3, brightness: 0.65 },
  { id: "taygeta", name: "Taygeta", x: 0.32, y: 0.52, radius: 3, brightness: 0.6 },
  { id: "pleione", name: "Pleione", x: 0.68, y: 0.5, radius: 2.8, brightness: 0.55 },
];

/** Edges connecting sister stars to form the cluster shape. */
export const PLEIADES_EDGES: [string, string][] = [
  ["alcyone", "atlas"],
  ["alcyone", "electra"],
  ["alcyone", "maia"],
  ["alcyone", "merope"],
  ["alcyone", "taygeta"],
  ["alcyone", "pleione"],
  ["atlas", "taygeta"],
  ["atlas", "maia"],
  ["electra", "merope"],
  ["electra", "pleione"],
  ["maia", "merope"],
];

/** One star at a time, each line drawing before the next star appears. */
export const BUILD_SEQUENCE: BuildStep[] = [
  { kind: "star", id: "alcyone" },
  { kind: "line", from: "alcyone", to: "atlas" },
  { kind: "star", id: "atlas" },
  { kind: "line", from: "alcyone", to: "electra" },
  { kind: "star", id: "electra" },
  { kind: "line", from: "alcyone", to: "maia" },
  { kind: "star", id: "maia" },
  { kind: "line", from: "alcyone", to: "merope" },
  { kind: "star", id: "merope" },
  { kind: "line", from: "alcyone", to: "taygeta" },
  { kind: "star", id: "taygeta" },
  { kind: "line", from: "alcyone", to: "pleione" },
  { kind: "star", id: "pleione" },
  { kind: "line", from: "atlas", to: "taygeta" },
  { kind: "line", from: "atlas", to: "maia" },
  { kind: "line", from: "electra", to: "merope" },
  { kind: "line", from: "electra", to: "pleione" },
  { kind: "line", from: "maia", to: "merope" },
];

const STEP_MS = 420;
const LINE_DRAW_S = 0.55;

export function stepDelay(index: number): number {
  return index * (STEP_MS / 1000);
}

/** Title fade begins as early connections form. */
export const HERO_TITLE_DELAY_S = stepDelay(2);

/** Title fade ends as the final constellation line completes. */
export const HERO_TITLE_DURATION_S =
  stepDelay(BUILD_SEQUENCE.length - 1) + LINE_DRAW_S - HERO_TITLE_DELAY_S;

export function lineLength(a: Star, b: Star, size = 400): number {
  const dx = (b.x - a.x) * size;
  const dy = (b.y - a.y) * size;
  return Math.hypot(dx, dy);
}

export function getStarById(id: string): Star | undefined {
  return PLEIADES_STARS.find((s) => s.id === id);
}
