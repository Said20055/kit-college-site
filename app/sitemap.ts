import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/college";
import { getSvedenSections } from "@/lib/data/sveden";
import { getPublishedNews } from "@/lib/data/news";

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [svedenSections, news] = await Promise.all([
    getSvedenSections(),
    getPublishedNews(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/abiturient`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/sveden`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const svedenRoutes = svedenSections.map(
    (s): Entry => ({
      url: `${siteUrl}/sveden/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const newsRoutes = news.map(
    (n): Entry => ({
      url: `${siteUrl}/news/${n.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    }),
  );

  return [...staticRoutes, ...svedenRoutes, ...newsRoutes];
}
