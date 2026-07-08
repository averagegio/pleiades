"use client";

import Image from "next/image";
import { useState } from "react";

type WearMode = "shirt" | "bag";

const WEAR_IMAGES: Record<
  WearMode,
  { src: string; alt: string; caption: string }
> = {
  shirt: {
    src: "/images/pin/on-shirt.png",
    alt: "Pleiades pin on a black jacket lapel",
    caption: "Left lapel · everyday carry",
  },
  bag: {
    src: "/images/pin/on-bag.png",
    alt: "Pleiades pin on a canvas tote bag strap",
    caption: "Strap · always within reach",
  },
};

export function PinLifestyleMockup({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<WearMode>("shirt");
  const image = WEAR_IMAGES[mode];

  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-300">Wear it</p>
        <div className="flex rounded-full border border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => setMode("shirt")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "shirt"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Shirt
          </button>
          <button
            type="button"
            onClick={() => setMode("bag")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === "bag"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Bag
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="relative aspect-[4/5] w-full">
          <Image
            key={mode}
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover object-center transition-opacity duration-300"
            sizes="(max-width: 896px) 100vw, 896px"
            priority={mode === "shirt"}
          />
        </div>
      </div>
      <p className="text-center text-xs text-zinc-600">{image.caption}</p>
    </section>
  );
}
