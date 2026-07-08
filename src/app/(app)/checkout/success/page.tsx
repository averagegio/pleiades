import Link from "next/link";

type Props = {
  searchParams: Promise<{ order?: string; mode?: string; session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const demo = params.mode === "demo";

  return (
    <div className="min-h-dvh bg-black text-zinc-50">
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-28 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
          Checkout
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          You&apos;re on the list
        </h1>
        <p className="mt-4 text-zinc-400">
          {demo
            ? "Demo checkout complete — no card was charged. Add Stripe keys to collect real pre-orders."
            : "Payment received. We’ll email shipping updates for your Pleiades Pin."}
        </p>
        {(params.order || params.session_id) && (
          <p className="mt-3 text-xs text-zinc-600">
            Ref: {params.order ?? params.session_id}
          </p>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/journal"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-50 px-6 text-sm font-medium text-black hover:bg-zinc-300"
          >
            Open journal
          </Link>
          <Link
            href="/pin"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-sm text-zinc-200 hover:bg-white/5"
          >
            Back to pin
          </Link>
        </div>
      </main>
    </div>
  );
}
