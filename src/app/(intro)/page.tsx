"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PleiadesHero } from "@/components/PleiadesHero";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { WatchList } from "@/components/WatchList";

function WatchListFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-black pt-28 text-zinc-600">
      Loading stars…
    </div>
  );
}

export default function IntroPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNav, setShowNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return (
    <AppShell showNav={showNav}>
      <div
        ref={containerRef}
        className="h-dvh overflow-y-auto overflow-x-hidden bg-black scroll-smooth snap-y snap-mandatory"
      >
        <section
          id="intro"
          className="relative flex h-dvh snap-start snap-always flex-col items-center justify-center bg-black"
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

        <section id="watch" className="relative min-h-dvh snap-start bg-black">
          <div
            className="pointer-events-none sticky top-0 z-20 h-[45vh] -mb-[45vh]"
            style={{
              background: `linear-gradient(to bottom,
                rgba(0,0,0,1) 0%,
                rgba(0,0,0,${1 - scrollProgress * 0.15}) 30%,
                rgba(0,0,0,0) 100%)`,
            }}
            aria-hidden="true"
          />
          <Suspense fallback={<WatchListFallback />}>
            <WatchList />
          </Suspense>
        </section>
      </div>
    </AppShell>
  );
}
