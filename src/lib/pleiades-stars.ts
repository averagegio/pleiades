export type Star = {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  brightness: number;
};

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

export function getStarById(id: string): Star | undefined {
  return PLEIADES_STARS.find((s) => s.id === id);
}
