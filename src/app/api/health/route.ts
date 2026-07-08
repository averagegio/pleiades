import { NextResponse } from "next/server";
import { pingDatabase, usingNeon } from "@/lib/db";
import { stripeConfigured } from "@/lib/checkout";
import { xConfigured } from "@/lib/x-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await pingDatabase();
    return NextResponse.json({
      ok: true,
      database: db,
      stripe: stripeConfigured(),
      x: xConfigured(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
      neonEnvPresent: usingNeon(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Health check failed",
        neonEnvPresent: usingNeon(),
        stripe: stripeConfigured(),
        x: xConfigured(),
      },
      { status: 500 },
    );
  }
}
