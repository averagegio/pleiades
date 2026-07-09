import type { Metadata } from "next";
import { PitchDeck } from "@/components/PitchDeck";

export const metadata: Metadata = {
  title: "Pitch Deck — Pleiades",
  description:
    "Pleiades investor pitch: people-watching journal, Pin hardware, SEO growth loop, and funding roadmap.",
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <PitchDeck />;
}
