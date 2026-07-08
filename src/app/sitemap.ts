import type { MetadataRoute } from "next";
import { listPublicJournals } from "@/lib/journal";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/pin",
    "/about",
    "/journal",
    "/login",
    "/privacy",
    "/terms",
    "/safety",
  ].map((path) => ({
    url: `${origin}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/journal" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const articles = await listPublicJournals();
  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${origin}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));

  return [...staticRoutes, ...articleRoutes];
}
