import Link from "next/link";
import { DemoVideo } from "@/components/DemoVideo";
import { PinMockup } from "@/components/PinMockup";

const PREORDER_MAILTO =
  "mailto:preorder@pleiades.app?subject=Pleiades%20Pin%20Pre-order&body=I%20would%20like%20to%20pre-order%20the%20Pleiades%20Pin.";

export default function PinPage() {
  return (
    <div className="min-h-dvh bg-black text-zinc-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-28">
        <header className="flex flex-col gap-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
            Hardware
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Pleiades Pin
          </h1>
          <p className="mx-auto max-w-lg text-zinc-400">
            One tap captures a spark. Your constellation grows in the app — no
            phone out, no awkward moment.
          </p>
        </header>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:justify-between">
          <PinMockup className="lg:w-1/2" />

          <div className="flex max-w-md flex-col gap-6 lg:w-1/2">
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                Single press logs a spark — open the app later to name your star
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                Soft blue LED confirms the moment without a screen
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                BLE syncs with Pleiades on your phone
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                Private by design — the pin records your intent, not other people
              </li>
            </ul>

            <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
              <p className="text-2xl font-semibold">$49</p>
              <p className="mt-1 text-sm text-zinc-500">
                Early bird pre-order · ships Q4 2026
              </p>
              <a
                href={PREORDER_MAILTO}
                id="preorder"
                className="mt-5 flex h-12 items-center justify-center rounded-full bg-zinc-50 text-sm font-medium text-black transition-colors hover:bg-zinc-300"
              >
                Pre-order now
              </a>
              <p className="mt-3 text-center text-xs text-zinc-600">
                No payment collected yet — we&apos;ll confirm your spot by email.
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-white/10 bg-zinc-950/50 p-8">
          <h2 className="text-lg font-medium">How it works</h2>
          <ol className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
            <li>
              <strong className="text-zinc-200">1. Tap</strong> — Someone
              catches your eye. Press the pin.
            </li>
            <li>
              <strong className="text-zinc-200">2. Sync</strong> — The spark
              appears in Electra (Sparks) orbit when you open the app.
            </li>
            <li>
              <strong className="text-zinc-200">3. Connect</strong> — Name your
              star, assign a sister orbit, watch your constellation grow.
            </li>
          </ol>
        </section>

        <DemoVideo
          title="See the pin in action"
          description="A quick walkthrough of the Pleiades Pin product page, features, and pre-order flow."
          src="/demos/pin-demo.mp4"
        />

        <p className="text-center text-sm text-zinc-600">
          <Link href="/" className="underline hover:text-zinc-400">
            Back to the sky
          </Link>
        </p>
      </main>
    </div>
  );
}
