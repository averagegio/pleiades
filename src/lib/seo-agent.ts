import { slugify } from "@/lib/journal";
import type { JournalEntry } from "@/lib/types";

export type SeoAgentResult = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  seoScore: number;
  seoNotes: string[];
  optimizedBody: string;
  iterations: number;
};

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "into",
  "about",
  "have",
  "been",
  "were",
  "they",
  "them",
  "their",
  "what",
  "when",
  "where",
  "which",
  "while",
  "will",
  "would",
  "could",
  "should",
  "a",
  "an",
  "of",
  "to",
  "in",
  "on",
  "at",
  "by",
  "or",
  "as",
  "is",
  "it",
  "be",
]);

function extractKeywords(text: string, limit = 8): string[] {
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z]{3,}/g) ?? []) {
    if (STOP_WORDS.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function scoreSeo(input: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
  keywords: string[];
  slug: string;
}): { score: number; notes: string[] } {
  const notes: string[] = [];
  let score = 40;

  if (input.metaTitle.length >= 30 && input.metaTitle.length <= 60) {
    score += 15;
    notes.push("Meta title length is in the click-friendly 30–60 range.");
  } else {
    notes.push("Tighten meta title toward 30–60 characters for SERP clicks.");
  }

  if (
    input.metaDescription.length >= 120 &&
    input.metaDescription.length <= 160
  ) {
    score += 15;
    notes.push("Meta description length fits the 120–160 SERP window.");
  } else {
    notes.push("Expand or trim meta description toward 120–160 characters.");
  }

  if (input.slug.length >= 4 && input.slug.length <= 60) {
    score += 10;
    notes.push("Slug is concise and URL-safe.");
  }

  const wordCount = input.body.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 180) {
    score += 10;
    notes.push("Body has enough depth for topical coverage.");
  } else {
    notes.push("Add more substance (aim for 180+ words) before publishing.");
  }

  const lowerBody = input.body.toLowerCase();
  const keywordHits = input.keywords.filter((k) => lowerBody.includes(k)).length;
  if (keywordHits >= Math.min(3, input.keywords.length)) {
    score += 10;
    notes.push("Primary keywords appear naturally in the body.");
  } else {
    notes.push("Weave primary keywords into the opening and subheads.");
  }

  if (/\n##\s|\n###\s|^##\s|^###\s/m.test(input.body)) {
    score += 5;
    notes.push("Subheadings improve scanability and featured-snippet odds.");
  } else {
    notes.push("Add H2/H3 subheads to structure the article.");
  }

  if (input.title.toLowerCase().includes("pleiades") || lowerBody.includes("pleiades")) {
    score += 5;
    notes.push("Brand mention supports entity relevance.");
  }

  return { score: Math.min(100, score), notes };
}

function buildMetaDescription(title: string, body: string): string {
  const clean = body.replace(/\s+/g, " ").trim();
  const lead = clean.slice(0, 140);
  const base = `${title}: ${lead}`;
  if (base.length <= 155) return `${base}${clean.length > 140 ? "…" : ""}`;
  return `${base.slice(0, 152)}…`;
}

function ensureHeadings(title: string, body: string, keywords: string[]): string {
  if (/\n##\s|^##\s/m.test(body)) return body;
  const primary = keywords[0] ?? "observation";
  const secondary = keywords[1] ?? "signal";
  return [
    body.trim(),
    "",
    `## Why ${primary} matters`,
    `A clear read on ${primary} helps you notice patterns before they fade.`,
    "",
    `## How to watch for ${secondary}`,
    `Keep notes short, dated, and honest — then revisit when the sky shifts.`,
    "",
    `## Closing note on ${title}`,
    "Publish only what belongs in the public sky. Keep private orbits private.",
  ].join("\n");
}

/**
 * Deterministic SEO optimization loop for public journal articles.
 * Runs multiple scoring passes and mutates title/description/body until
 * the score plateaus or hits the target threshold.
 */
export async function runSeoAgentLoop(
  entry: Pick<JournalEntry, "title" | "body" | "orbit">,
  options: { targetScore?: number; maxIterations?: number } = {},
): Promise<SeoAgentResult> {
  const targetScore = options.targetScore ?? 80;
  const maxIterations = options.maxIterations ?? 4;

  let title = entry.title.trim();
  let body = entry.body.trim();
  let keywords = extractKeywords(`${title} ${body}`);
  let slug = slugify(title) || `sky-${Date.now().toString(36)}`;
  let metaTitle = title.length <= 60 ? `${title} | Pleiades` : `${title.slice(0, 48)}… | Pleiades`;
  let metaDescription = buildMetaDescription(title, body);
  let best = scoreSeo({
    title,
    metaTitle,
    metaDescription,
    body,
    keywords,
    slug,
  });
  let iterations = 0;
  const minPasses = 2;

  while (
    iterations < maxIterations &&
    (iterations < minPasses || best.score < targetScore)
  ) {
    iterations += 1;

    if (iterations === 1) {
      if (!title.toLowerCase().includes("pleiades") && entry.orbit === "sterope") {
        title = `${title} — Pleiades public sky`;
      }
      metaTitle =
        title.length <= 52
          ? `${title} | Pleiades Journal`
          : `${title.slice(0, 48)} | Pleiades`;
      metaDescription = buildMetaDescription(title, body);
    }

    if (iterations === 2) {
      body = ensureHeadings(title, body, keywords);
      keywords = extractKeywords(`${title} ${body}`);
      metaDescription = buildMetaDescription(title, body);
    }

    if (iterations >= 3) {
      const opener = keywords[0]
        ? `People watching insight on ${keywords[0]}: `
        : "People watching insight: ";
      if (!body.toLowerCase().startsWith(opener.toLowerCase().slice(0, 12))) {
        body = `${opener}${body}`;
      }
      metaDescription = buildMetaDescription(title, body);
      if (metaDescription.length < 120) {
        metaDescription = `${metaDescription} Read the public journal note on Pleiades.`.slice(
          0,
          158,
        );
      }
    }

    slug = slugify(title) || slug;
    best = scoreSeo({
      title,
      metaTitle,
      metaDescription,
      body,
      keywords,
      slug,
    });
  }

  // Optional LLM polish when configured — never required for the loop to work.
  if (process.env.OPENAI_API_KEY && best.score < targetScore) {
    try {
      const polished = await polishWithOpenAI({
        title,
        body,
        metaTitle,
        metaDescription,
        keywords,
      });
      if (polished) {
        title = polished.title || title;
        body = polished.body || body;
        metaTitle = polished.metaTitle || metaTitle;
        metaDescription = polished.metaDescription || metaDescription;
        keywords = polished.keywords?.length ? polished.keywords : keywords;
        slug = slugify(title) || slug;
        best = scoreSeo({
          title,
          metaTitle,
          metaDescription,
          body,
          keywords,
          slug,
        });
        iterations += 1;
      }
    } catch {
      // Keep heuristic result if the model call fails.
    }
  }

  return {
    slug,
    metaTitle: metaTitle.slice(0, 70),
    metaDescription: metaDescription.slice(0, 165),
    keywords,
    seoScore: best.score,
    seoNotes: best.notes,
    optimizedBody: body,
    iterations,
  };
}

async function polishWithOpenAI(input: {
  title: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}): Promise<{
  title?: string;
  body?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
} | null> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You optimize public journal articles for search clicks. Return JSON with title, body, metaTitle, metaDescription, keywords. Keep the author's voice. Never invent private facts.",
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  return JSON.parse(content) as {
    title?: string;
    body?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}
