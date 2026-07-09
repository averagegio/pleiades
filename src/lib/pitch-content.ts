import { SISTER_ORBITS } from "@/lib/sister-orbits";

/** User journey stages mapped to sister orbits */
export const ORBIT_FLOW = [
  {
    step: 1,
    stage: "Capture",
    orbitIds: ["electra"] as const,
    action: "Pin tap or quick add — catch the spark before it fades.",
    product: "Watch list form · Electra orbit · BLE sync",
  },
  {
    step: 2,
    stage: "Prioritize",
    orbitIds: ["alcyone", "maia"] as const,
    action: "Move stars to center or nurture — who matters most right now?",
    product: "Orbit picker · brightness on Alcyone",
  },
  {
    step: 3,
    stage: "Hold lightly",
    orbitIds: ["taygeta"] as const,
    action: "Weak ties stay in orbit without daily noise.",
    product: "Distant filter · gentle reminders",
  },
  {
    step: 4,
    stage: "Protect",
    orbitIds: ["merope"] as const,
    action: "Blur until reveal — your most private notes.",
    product: "Vault UI · Pleiades Plus",
  },
  {
    step: 5,
    stage: "Release",
    orbitIds: ["celaeno"] as const,
    action: "Let stars go dim — archived, not deleted.",
    product: "Hidden from default list · recoverable",
  },
  {
    step: 6,
    stage: "Publish",
    orbitIds: ["sterope"] as const,
    action: "Public persona only — SEO loop → article → X.",
    product: "Journal dashboard · /articles · Post to X",
  },
];

export const MARKETING_90 = [
  {
    month: "Month 1",
    target: "75K–150K signups",
    theme: "Ignite the loop",
    tactics: [
      "Launch narrative + orbit share OG cards",
      "50–100 micro-creators (writing, travel, dating)",
      "Paid Shorts test ($25–75K) · OAuth + referral",
    ],
    kpis: "D1 activation ≥40% · viral coeff ≥0.15",
  },
  {
    month: "Month 2",
    target: "250K–400K cumulative",
    theme: "Scale what works",
    tactics: [
      "Double winning channel · #PublicSky challenge",
      "500–2K SEO articles via Sterope loop",
      "Pin $5–10 deposit · waitlist counter",
    ],
    kpis: "8–12K signups/day · W1 retention ≥25%",
  },
  {
    month: "Month 3",
    target: "1M cumulative",
    theme: "Blitz to one million",
    tactics: [
      "National People-Watching Day · city ambassador pods",
      "Performance max on top UGC · retarget journal",
      "PR: aggregate stars added (privacy-safe)",
    ],
    kpis: "15–25K signups/day · 350K+ MAU",
  },
];

export const MARKETING_SCALE = [
  {
    phase: "Months 4–6",
    title: "Retention & monetization",
    items: [
      "Ship Pleiades Plus (vault, SEO runs, X schedule)",
      "Pin fulfillment · BLE → Electra sync campaign",
      "Weekly orbit digest · Sterope creator tier",
    ],
    target: "500K MAU · 5% paid · 100K Pin pipeline",
  },
  {
    phase: "Months 6–9",
    title: "Brand expansion",
    items: [
      "Public Sky network · creator profiles",
      "Pin v2 + accessories · retail design partners",
      "Pleiades Salons · city chapters + print journal",
    ],
    target: "1.5–2M MAU · $2–5M ARR",
  },
  {
    phase: "Months 9–12",
    title: "Platform & category",
    items: [
      "Teams + Sparks API · ethical trend reports",
      "International · sponsored orbits (topics, not people)",
      "Hardware line + media network for Series A story",
    ],
    target: "3–5M MAU · $15–40M ARR",
  },
];

export function orbitById(id: string) {
  return SISTER_ORBITS.find((o) => o.id === id);
}
