import { NextResponse } from "next/server";
import { AuthError, getSessionUser } from "@/lib/auth";
import {
  createJournal,
  deleteJournal,
  journalStats,
  listJournalsForUser,
  updateJournal,
} from "@/lib/journal";
import type { SisterOrbitId } from "@/lib/sister-orbits";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const entries = await listJournalsForUser(user.id);
  return NextResponse.json({
    entries,
    stats: journalStats(entries),
  });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("Sign in required");

    const body = (await request.json()) as {
      title?: string;
      body?: string;
      orbit?: SisterOrbitId;
    };

    const entry = await createJournal({
      userId: user.id,
      title: body.title ?? "",
      body: body.body ?? "",
      orbit: body.orbit ?? "electra",
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    const status = err instanceof AuthError ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("Sign in required");

    const body = (await request.json()) as {
      id?: string;
      title?: string;
      body?: string;
      orbit?: SisterOrbitId;
      isPublic?: boolean;
    };

    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const entry = await updateJournal(user.id, body.id, {
      title: body.title,
      body: body.body,
      orbit: body.orbit,
      isPublic: body.isPublic,
      publishedAt:
        body.isPublic === true
          ? new Date().toISOString()
          : body.isPublic === false
            ? null
            : undefined,
    });

    return NextResponse.json({ entry });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const status = err instanceof AuthError ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("Sign in required");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await deleteJournal(user.id, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    const status = err instanceof AuthError ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
