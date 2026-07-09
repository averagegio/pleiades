"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body?: string;
  content: React.ReactNode;
};

const ROUNDS = [
  {
    name: "Pre-Seed",
    range: "$100K – $500K",
    use: "Ship core loop, Pin tooling, early growth",
    milestones: [
      "10K waitlist / 2K MAU",
      "Pin MVP manufacturing LOI",
      "SEO agent live on public sky",
    ],
  },
  {
    name: "Seed",
    range: "$5M – $10M",
    use: "Scale acquisition, hardware inventory, brand",
    milestones: [
      "100K MAU · 8% paid conversion",
      "50K Pins shipped",
      "Creator / Sterope public network",
    ],
  },
  {
    name: "Series A",
    range: "$800M – $1B",
    use: "Category ownership, global hardware + media",
    milestones: [
      "10M+ MAU · multi-product suite",
      "Pin + wearables line expansion",
      "Public content flywheel at search scale",
    ],
  },
];

const FUNNEL = [
  {
    stage: "Acquire",
    detail: "Constellation intro · SEO public articles · X posts",
    metric: "Top-of-funnel attention",
  },
  {
    stage: "Activate",
    detail: "Watch list stars · sister orbits · private notes",
    metric: "Habit formation",
  },
  {
    stage: "Subscribe",
    detail: "Pleiades Plus — vault, SEO agent, sync, X publish",
    metric: "$12 / mo or $99 / yr",
  },
  {
    stage: "Hardware",
    detail: "Pleiades Pin pre-order → checkout → BLE sparks",
    metric: "$49 early bird",
  },
  {
    stage: "Expand",
    detail: "Public sky ads · creator tools · enterprise orbits",
    metric: "ARPU lift",
  },
];

const PROJECTIONS = [
  {
    year: "Y1",
    label: "Pre-Seed → Seed",
    mau: "25K",
    paid: "1.5K",
    pins: "8K",
    arr: "$0.4M",
  },
  {
    year: "Y2",
    label: "Seed scale",
    mau: "250K",
    paid: "20K",
    pins: "60K",
    arr: "$4.2M",
  },
  {
    year: "Y3",
    label: "Series A path",
    mau: "1.8M",
    paid: "160K",
    pins: "220K",
    arr: "$38M",
  },
  {
    year: "Y5",
    label: "Category lead",
    mau: "12M",
    paid: "1.4M",
    pins: "1.1M",
    arr: "$420M",
  },
];

function Shot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="relative aspect-[16/10] w-full bg-black">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 900px) 100vw, 720px"
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="border-t border-white/10 px-4 py-2 text-xs text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ShotGrid({
  items,
}: {
  items: { src: string; alt: string; caption: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Shot key={item.src} {...item} />
      ))}
    </div>
  );
}

const slides: Slide[] = [
  {
    id: "title",
    eyebrow: "Investor deck · 2026",
    title: "Pleiades",
    body: "The people-watching app — private constellation, public sky, wearable spark.",
    content: (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="max-w-xl text-lg leading-relaxed text-zinc-300">
            Capture who&apos;s in your sky. Keep notes private. Publish what
            earns attention. Wear a pin that logs the spark without pulling out
            a phone.
          </p>
          <ul className="flex flex-wrap gap-3 text-sm text-zinc-400">
            <li className="rounded-full border border-white/15 px-3 py-1.5">
              Journal + SEO agent
            </li>
            <li className="rounded-full border border-white/15 px-3 py-1.5">
              $49 Pin hardware
            </li>
            <li className="rounded-full border border-white/15 px-3 py-1.5">
              Subscriptions + X
            </li>
          </ul>
        </div>
        <Shot
          src="/pitch/01-intro.png"
          alt="Pleiades constellation intro"
          caption="Brand hero — constellation intro"
        />
      </div>
    ),
  },
  {
    id: "problem",
    eyebrow: "Problem",
    title: "Attention is social. Memory is broken.",
    body: "People notice people constantly — but notes live in chats, cameras feel invasive, and public writing has no private origin.",
    content: (
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "Awkward capture",
            d: "Phone-out moments kill the spark. Wearables today over-record.",
          },
          {
            t: "No private layer",
            d: "CRM tools feel corporate. Notes apps ignore social orbits.",
          },
          {
            t: "Growth without soul",
            d: "Creators need SEO + distribution without turning private life public.",
          },
        ].map((card) => (
          <div
            key={card.t}
            className="rounded-xl border border-white/10 bg-zinc-950/70 p-5"
          >
            <h3 className="text-base font-semibold text-zinc-100">{card.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              {card.d}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "solution",
    eyebrow: "Solution",
    title: "One constellation. Three surfaces.",
    body: "Watch list for private people-watching, Journal for drafts → public SEO articles, Pin for offline capture.",
    content: (
      <ShotGrid
        items={[
          {
            src: "/pitch/02-watch.png",
            alt: "Watch list with sister orbits",
            caption: "Watch list — sister orbits & private stars",
          },
          {
            src: "/pitch/03-journal.png",
            alt: "Journal dashboard",
            caption: "Journal dashboard — SEO loop + X share",
          },
          {
            src: "/pitch/05-pin.png",
            alt: "Pleiades Pin product page",
            caption: "Pleiades Pin — $49 wearable spark",
          },
          {
            src: "/pitch/04-login.png",
            alt: "Login and signup",
            caption: "Account — unlock journal, checkout, X",
          },
        ]}
      />
    ),
  },
  {
    id: "product",
    eyebrow: "Product tour",
    title: "Built end-to-end today",
    body: "Live on Vercel with Neon, Stripe checkout, auth, journal SEO agent, and X posting hooks.",
    content: (
      <div className="grid gap-4 lg:grid-cols-3">
        <Shot
          src="/pitch/09-drawer.png"
          alt="Sidebar navigation"
          caption="Sidebar — Journal, Checkout, Account & X"
        />
        <Shot
          src="/pitch/06-checkout.png"
          alt="Pin checkout"
          caption="Checkout — Stripe-ready $49 pre-order"
        />
        <Shot
          src="/pitch/07-account.png"
          alt="Account settings"
          caption="Account — session, X, journal shortcuts"
        />
      </div>
    ),
  },
  {
    id: "value",
    eyebrow: "Value add",
    title: "Why Pleiades wins the category",
    content: (
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Privacy-first people graph",
            copy: "Seven sister orbits map intent without surveillance. Vault (Merope) stays blurred until you reveal.",
          },
          {
            title: "SEO agent loop",
            copy: "Private drafts become public articles with scored meta, slugs, keywords, and sitemap — churning search clicks.",
          },
          {
            title: "Hardware wedge",
            copy: "The Pin captures sparks offline. BLE syncs into Electra. Phone stays pocketed; constellation still grows.",
          },
          {
            title: "Distribution built-in",
            copy: "Public sky + X posting turns journals into a growth engine instead of a dead-end notes app.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_top_left,rgba(147,197,253,0.08),transparent_55%),#09090b] p-6"
          >
            <h3 className="text-lg font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {item.copy}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "funnel",
    eyebrow: "Revenue funnel",
    title: "Attention → habit → subscription → Pin → expand",
    body: "Multiple monetization layers on one identity graph.",
    content: (
      <div className="space-y-3">
        {FUNNEL.map((step, i) => (
          <div
            key={step.stage}
            className="grid items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-4 sm:grid-cols-[auto_1fr_auto]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs text-zinc-300">
                {i + 1}
              </span>
              <span className="text-sm font-semibold tracking-wide">
                {step.stage}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{step.detail}</p>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {step.metric}
            </p>
          </div>
        ))}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              Subscriptions
            </p>
            <p className="mt-2 text-2xl font-semibold">Plus</p>
            <p className="mt-1 text-sm text-zinc-500">
              Vault, SEO agent runs, sync, X publish — $12/mo
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              Hardware
            </p>
            <p className="mt-2 text-2xl font-semibold">Pin</p>
            <p className="mt-1 text-sm text-zinc-500">
              $49 early bird · accessories & replacements
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              Network
            </p>
            <p className="mt-2 text-2xl font-semibold">Public sky</p>
            <p className="mt-1 text-sm text-zinc-500">
              Sponsored orbits · creator boosts · API
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "projections",
    eyebrow: "Projections",
    title: "Five-year growth model",
    body: "Illustrative operating plan — mixes subscription ARR with Pin hardware revenue.",
    content: (
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Phase</th>
              <th className="px-4 py-3 font-medium">MAU</th>
              <th className="px-4 py-3 font-medium">Paid subs</th>
              <th className="px-4 py-3 font-medium">Pins sold</th>
              <th className="px-4 py-3 font-medium">ARR + HW</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTIONS.map((row) => (
              <tr key={row.year} className="border-t border-white/10">
                <td className="px-4 py-4 font-semibold text-zinc-100">
                  {row.year}
                </td>
                <td className="px-4 py-4 text-zinc-400">{row.label}</td>
                <td className="px-4 py-4">{row.mau}</td>
                <td className="px-4 py-4">{row.paid}</td>
                <td className="px-4 py-4">{row.pins}</td>
                <td className="px-4 py-4 font-medium text-sky-200/90">
                  {row.arr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-white/10 px-4 py-3 text-xs text-zinc-600">
          Assumptions: ~8–12% free→paid conversion by Y3; Pin attach ~15–25% of
          activated users; public SEO + X as primary unpaid acquisition.
        </p>
      </div>
    ),
  },
  {
    id: "funding",
    eyebrow: "Funding roadmap",
    title: "Pre-Seed → Seed → Series A",
    body: "Capital plan sized to product, hardware, and category ownership.",
    content: (
      <div className="grid gap-4 lg:grid-cols-3">
        {ROUNDS.map((round) => (
          <div
            key={round.name}
            className="flex flex-col rounded-xl border border-white/10 bg-zinc-950/80 p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              {round.name}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
              {round.range}
            </p>
            <p className="mt-3 text-sm text-zinc-400">{round.use}</p>
            <ul className="mt-5 flex flex-1 flex-col gap-2 border-t border-white/10 pt-4">
              {round.milestones.map((m) => (
                <li key={m} className="text-sm text-zinc-300">
                  <span className="mr-2 text-zinc-600">✦</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "ask",
    eyebrow: "The ask",
    title: "Join the constellation",
    content: (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_30%_0%,rgba(147,197,253,0.12),transparent_50%),#09090b] p-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            Opening round
          </p>
          <p className="mt-4 text-4xl font-semibold tracking-tight">
            Pre-Seed $100K–$500K
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Fund manufacturing pilots, subscription billing, SEO/X growth loops,
            and the first 10K users who treat people-watching as a daily
            practice — not a creepy side habit.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 px-4 py-3">
              <p className="text-xs text-zinc-600">Next</p>
              <p className="mt-1 font-medium">Seed $5M–$10M</p>
            </div>
            <div className="rounded-lg border border-white/10 px-4 py-3">
              <p className="text-xs text-zinc-600">Scale</p>
              <p className="mt-1 font-medium">Series A $800M–$1B</p>
            </div>
          </div>
        </div>
        <Shot
          src="/pitch/01-intro.png"
          alt="Pleiades brand"
          caption="pleiades-livid-pi.vercel.app"
        />
      </div>
    ),
  },
];

export function PitchDeck() {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const slide = slides[index];

  const go = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, total]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(147,197,253,0.1),transparent_40%),radial-gradient(ellipse_at_90%_20%,rgba(255,255,255,0.04),transparent_35%)]"
      />

      <main className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-24 sm:py-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
              {slide.eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              {slide.title}
            </h1>
            {slide.body && (
              <p className="mt-4 max-w-2xl text-base text-zinc-400">
                {slide.body}
              </p>
            )}
          </div>
          <p className="text-xs tabular-nums text-zinc-600">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>

        <div
          key={slide.id}
          className="pitch-slide flex-1"
        >
          {slide.content}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}: ${s.title}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-zinc-100"
                    : "w-3 bg-zinc-700 hover:bg-zinc-500"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="h-10 rounded-full border border-white/15 px-4 text-sm text-zinc-300 hover:bg-white/5"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="h-10 rounded-full bg-zinc-50 px-5 text-sm font-medium text-black hover:bg-zinc-300"
            >
              {index === total - 1 ? "Restart" : "Next"}
            </button>
          </div>
        </div>
        <p className="mt-4 text-center text-[11px] text-zinc-700">
          Arrow keys or space to advance · Screenshots from production
        </p>
      </main>
    </div>
  );
}
