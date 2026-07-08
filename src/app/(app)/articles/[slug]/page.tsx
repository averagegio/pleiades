import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicJournalBySlug, listPublicJournals } from "@/lib/journal";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await listPublicJournals();
  return entries
    .filter((e) => e.slug)
    .map((e) => ({ slug: e.slug as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicJournalBySlug(slug);
  if (!entry) return { title: "Article — Pleiades" };

  const title = entry.metaTitle ?? `${entry.title} | Pleiades`;
  const description =
    entry.metaDescription ?? entry.body.slice(0, 155).replace(/\s+/g, " ");

  return {
    title,
    description,
    keywords: entry.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: entry.publishedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/articles/${entry.slug}`,
    },
  };
}

export default async function PublicArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = await getPublicJournalBySlug(slug);
  if (!entry) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.metaTitle ?? entry.title,
    description: entry.metaDescription ?? undefined,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    keywords: entry.keywords.join(", "),
    author: {
      "@type": "Organization",
      name: "Pleiades",
    },
    publisher: {
      "@type": "Organization",
      name: "Pleiades",
    },
    mainEntityOfPage: `/articles/${entry.slug}`,
  };

  return (
    <div className="min-h-dvh bg-black text-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-2xl px-6 py-28">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
          Public sky · {entry.orbit}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {entry.title}
        </h1>
        {entry.metaDescription && (
          <p className="mt-4 text-lg text-zinc-400">{entry.metaDescription}</p>
        )}
        <article className="prose-invert mt-10 whitespace-pre-wrap text-[15px] leading-7 text-zinc-300">
          {entry.body}
        </article>
        {entry.keywords.length > 0 && (
          <p className="mt-10 text-xs text-zinc-600">
            Topics: {entry.keywords.join(" · ")}
          </p>
        )}
        <p className="mt-12 text-sm text-zinc-600">
          <Link href="/" className="underline hover:text-zinc-400">
            Back to Pleiades
          </Link>
        </p>
      </main>
    </div>
  );
}
