import { newId, updateDb } from "@/lib/db";
import type { OrderRecord } from "@/lib/types";

export const PIN_PRODUCT = {
  id: "pleiades-pin" as const,
  name: "Pleiades Pin",
  amountCents: 4900,
  currency: "usd",
  description: "Early bird pre-order · ships Q4 2026",
};

export function stripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

export async function createOrder(input: {
  email: string;
  userId: string | null;
  status: OrderRecord["status"];
  stripeSessionId?: string | null;
}): Promise<OrderRecord> {
  const order: OrderRecord = {
    id: newId("order"),
    userId: input.userId,
    email: input.email.trim().toLowerCase(),
    product: PIN_PRODUCT.id,
    amountCents: PIN_PRODUCT.amountCents,
    status: input.status,
    stripeSessionId: input.stripeSessionId ?? null,
    createdAt: new Date().toISOString(),
  };

  await updateDb((db) => {
    db.orders.push(order);
  });

  return order;
}

export async function createStripeCheckoutSession(input: {
  email: string;
  userId: string | null;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; sessionId: string; orderId: string }> {
  const secret = process.env.STRIPE_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", input.successUrl);
  params.append("cancel_url", input.cancelUrl);
  params.append("customer_email", input.email);
  params.append("line_items[0][price_data][currency]", PIN_PRODUCT.currency);
  params.append(
    "line_items[0][price_data][product_data][name]",
    PIN_PRODUCT.name,
  );
  params.append(
    "line_items[0][price_data][product_data][description]",
    PIN_PRODUCT.description,
  );
  params.append(
    "line_items[0][price_data][unit_amount]",
    String(PIN_PRODUCT.amountCents),
  );
  params.append("line_items[0][quantity]", "1");
  if (input.userId) params.append("metadata[userId]", input.userId);
  params.append("metadata[product]", PIN_PRODUCT.id);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stripe checkout failed: ${text}`);
  }

  const session = (await res.json()) as { id: string; url: string };
  const order = await createOrder({
    email: input.email,
    userId: input.userId,
    status: "pending",
    stripeSessionId: session.id,
  });

  return { url: session.url, sessionId: session.id, orderId: order.id };
}

export async function createDemoCheckout(input: {
  email: string;
  userId: string | null;
}): Promise<{ orderId: string; successPath: string }> {
  const order = await createOrder({
    email: input.email,
    userId: input.userId,
    status: "demo",
  });
  return {
    orderId: order.id,
    successPath: `/checkout/success?order=${order.id}&mode=demo`,
  };
}
