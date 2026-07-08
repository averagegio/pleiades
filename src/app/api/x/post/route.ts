import { NextResponse } from "next/server";
import { AuthError, getSessionUser } from "@/lib/auth";
import { getJournalForUser } from "@/lib/journal";
import {
  composeJournalTweet,
  postTweet,
  xConfigured,
} from "@/lib/x-api";

function siteOrigin(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("Sign in required");

    const body = (await request.json()) as {
      journalId?: string;
      text?: string;
    };

    let text = (body.text ?? "").trim();

    if (body.journalId) {
      const entry = await getJournalForUser(user.id, body.journalId);
      if (!entry) {
        return NextResponse.json({ error: "Journal not found" }, { status: 404 });
      }
      if (!entry.isPublic || !entry.slug) {
        return NextResponse.json(
          { error: "Only public journal articles can be posted to X" },
          { status: 400 },
        );
      }
      const url = `${siteOrigin(request)}/articles/${entry.slug}`;
      text = composeJournalTweet({
        title: entry.metaTitle ?? entry.title,
        excerpt: (entry.metaDescription ?? entry.body).slice(0, 160),
        url,
      });
    }

    if (!text) {
      return NextResponse.json({ error: "Post text required" }, { status: 400 });
    }

    // Demo mode when X app credentials are missing, or the user has not
    // completed OAuth yet — still returns a composed tweet preview.
    if (!xConfigured() || !user.xConnected || !user.xAccessToken) {
      return NextResponse.json({
        mode: "demo",
        tweet: { id: `demo_${Date.now()}`, text },
        message: !xConfigured()
          ? "X credentials are not configured. Previewed the post locally."
          : "Connect X in Account to publish live. Previewed the post locally.",
      });
    }

    const tweet = await postTweet(user.xAccessToken, text);
    return NextResponse.json({ mode: "live", tweet });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Post failed";
    const status = err instanceof AuthError ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
