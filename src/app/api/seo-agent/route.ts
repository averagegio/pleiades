import { NextResponse } from "next/server";
import { AuthError, getSessionUser } from "@/lib/auth";
import { getJournalForUser, updateJournal } from "@/lib/journal";
import { runSeoAgentLoop } from "@/lib/seo-agent";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("Sign in required");

    const body = (await request.json()) as {
      journalId?: string;
      publish?: boolean;
    };

    if (!body.journalId) {
      return NextResponse.json({ error: "journalId required" }, { status: 400 });
    }

    const entry = await getJournalForUser(user.id, body.journalId);
    if (!entry) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    const result = await runSeoAgentLoop(entry);

    const updated = await updateJournal(user.id, entry.id, {
      title: entry.title,
      body: result.optimizedBody,
      slug: result.slug,
      metaTitle: result.metaTitle,
      metaDescription: result.metaDescription,
      keywords: result.keywords,
      seoScore: result.seoScore,
      seoNotes: result.seoNotes,
      isPublic: body.publish === false ? entry.isPublic : true,
      publishedAt:
        body.publish === false
          ? entry.publishedAt
          : entry.publishedAt ?? new Date().toISOString(),
    });

    return NextResponse.json({
      entry: updated,
      seo: result,
      publicPath: updated.slug ? `/articles/${updated.slug}` : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "SEO agent failed";
    const status = err instanceof AuthError ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
