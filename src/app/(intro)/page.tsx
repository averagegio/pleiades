"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ConstellationBackground } from "@/components/ConstellationBackground";
import { PleiadesHero } from "@/components/PleiadesHero";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { WatchList } from "@/components/WatchList";
import { useWatchedStars } from "@/lib/watched-stars";

function WatchListFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black pt-28 text-zinc-600">
      Loading stars…
    </div>
  );
}

function IntroScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [stars, setStars] = useWatchedStars();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, clientHeight } = container;
      const progress = Math.min(scrollTop / clientHeight, 1);
      setScrollProgress(progress);
      setShowNav(progress > 0.35);
    };

    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#watch" || window.location.search.includes("orbit=")) {
      document.getElementById("watch")?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (highlightId == null) return;
    const timer = window.setTimeout(() => setHighlightId(null), 1200);
    return () => clearTimeout(timer);
  }, [highlightId]);

  return (
    <AppShell showNav={showNav}>
      <ConstellationBackground
        scrollProgress={scrollProgress}
        stars={stars}
        highlightId={highlightId}
      />
      <div
        ref={containerRef}
        className="relative z-10 h-dvh overflow-y-auto overflow-x-hidden bg-transparent scroll-smooth snap-y snap-mandatory"
      >
        <section
          id="intro"
          className="relative flex h-dvh snap-start snap-always flex-col items-center justify-center bg-black/40"
        >
          <div className="flex w-full max-w-lg flex-col items-center gap-10 px-6">
            <div className="h-64 w-64 sm:h-80 sm:w-80">
              <PleiadesHero className="h-full w-full" />
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-zinc-50 sm:text-7xl">
              Pleiades
            </h1>
          </div>
          <ScrollIndicator />
        </section>

        <section id="watch" className="relative min-h-dvh snap-start">
          <div
            className="pointer-events-none sticky top-0 z-20 h-[45vh] -mb-[45vh]"
            style={{
              background: `linear-gradient(to bottom,
                rgba(0,0,0,0.85) 0%,
                rgba(0,0,0,${0.85 - scrollProgress * 0.15}) 30%,
                rgba(0,0,0,0) 100%)`,
            }}
            aria-hidden="true"
          />
          <WatchList
            stars={stars}
            setStars={setStars}
            onStarAdded={setHighlightId}
          />
        </section>
      </div>
    </AppShell>
  );
}

export default function IntroPage() {
  return (
    <Suspense fallback={<WatchListFallback />}>
      <IntroScrollExperience />
    </Suspense>
  );
}
