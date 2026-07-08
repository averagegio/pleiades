import Link from "next/link";
import { PinHowTo, PinSchematicHero } from "@/components/how-to/PinHowTo";
import { PinLifestyleMockup } from "@/components/PinLifestyleMockup";

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
            A brushed-metal disc with a star LED. One tap to capture a spark —
            your constellation grows in the app, no phone out, no awkward moment.
          </p>
        </header>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:w-1/2">
            <PinSchematicHero />
          </div>

          <div className="flex max-w-md flex-col gap-6 lg:w-1/2">
            <ul className="flex flex-col gap-4 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                Minimal circular disc — wear it, tap once
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                Star-shaped LED confirms each spark
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                BLE syncs to Electra orbit in the app
              </li>
              <li className="flex gap-3">
                <span className="text-zinc-200">✦</span>
                Private by design — intent only, not surveillance
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

        <PinLifestyleMockup />

        <PinHowTo />

        <p className="text-center text-sm text-zinc-600">
          <Link href="/" className="underline hover:text-zinc-400">
            Back to the sky
          </Link>
        </p>
      </main>
    </div>
  );
}
