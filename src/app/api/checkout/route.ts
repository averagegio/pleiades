import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  createDemoCheckout,
  createStripeCheckoutSession,
  stripeConfigured,
} from "@/lib/checkout";

function siteOrigin(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const user = await getSessionUser();
    const email = (body.email ?? user?.email ?? "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required for checkout" },
        { status: 400 },
      );
    }

    const origin = siteOrigin(request);

    if (stripeConfigured()) {
      const session = await createStripeCheckoutSession({
        email,
        userId: user?.id ?? null,
        successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/pin#preorder`,
      });
      return NextResponse.json({
        mode: "stripe",
        url: session.url,
        orderId: session.orderId,
      });
    }

    const demo = await createDemoCheckout({
      email,
      userId: user?.id ?? null,
    });

    return NextResponse.json({
      mode: "demo",
      url: demo.successPath,
      orderId: demo.orderId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
