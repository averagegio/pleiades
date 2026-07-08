export type SisterOrbitId =
  | "alcyone"
  | "maia"
  | "electra"
  | "taygeta"
  | "celaeno"
  | "sterope"
  | "merope";

export type SisterOrbit = {
  id: SisterOrbitId;
  name: string;
  feature: string;
  tagline: string;
  description: string;
  /** Normalized 0–1 position for constellation picker */
  x: number;
  y: number;
};

/** The seven Pleiades sisters — each maps to one app subgroup + feature. */
export const SISTER_ORBITS: SisterOrbit[] = [
  {
    id: "alcyone",
    name: "Alcyone",
    feature: "Core",
    tagline: "Who's at the center of your sky?",
    description: "Your brightest stars — the people most on your mind right now.",
    x: 0.5,
    y: 0.46,
  },
  {
    id: "maia",
    name: "Maia",
    feature: "Nurture",
    tagline: "Who deserves a little attention?",
    description: "Relationships you're actively tending and want to follow up on.",
    x: 0.42,
    y: 0.58,
  },
  {
    id: "electra",
    name: "Electra",
    feature: "Sparks",
    tagline: "Catch the spark before it fades.",
    description: "Recent encounters and quick captures — someone you just met.",
    x: 0.62,
    y: 0.34,
  },
  {
    id: "taygeta",
    name: "Taygeta",
    feature: "Distant",
    tagline: "Far away, still in orbit.",
    description: "Weak ties and people you rarely see but don't want to forget.",
    x: 0.28,
    y: 0.5,
  },
  {
    id: "celaeno",
    name: "Celaeno",
    feature: "Archive",
    tagline: "Let stars go dim.",
    description: "Soft-archived stars — out of daily view, not deleted.",
    x: 0.34,
    y: 0.36,
  },
  {
    id: "sterope",
    name: "Sterope",
    feature: "Public sky",
    tagline: "Lights you watch from afar.",
    description: "Public figures and creators — notes on their public persona only.",
    x: 0.7,
    y: 0.48,
  },
  {
    id: "merope",
    name: "Merope",
    feature: "Hidden",
    tagline: "Stars you keep to yourself.",
    description: "Your most private entries — blurred until you choose to reveal.",
    x: 0.56,
    y: 0.64,
  },
];

export const SISTER_ORBIT_IDS = SISTER_ORBITS.map((o) => o.id);

export function getOrbitById(id: SisterOrbitId): SisterOrbit {
  const orbit = SISTER_ORBITS.find((o) => o.id === id);
  if (!orbit) throw new Error(`Unknown orbit: ${id}`);
  return orbit;
}

export const DEFAULT_ORBIT: SisterOrbitId = "electra";
