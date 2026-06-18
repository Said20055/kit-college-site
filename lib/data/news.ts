import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";

/** Новость в форме, ожидаемой публичными компонентами (NewsCard и др.). */
export type NewsItem = {
  slug: string;
  date: string; // «10 июня 2026»
  iso: string; // «2026-06-10»
  tag: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  cover: { url: string; alt: string; width: number | null; height: number | null } | null;
};

const coverSelect = {
  cover: { select: { id: true, alt: true, width: true, height: true } },
};

const ruDate = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatRuDate(d: Date): string {
  return ruDate.format(d).replace(/\s*г\.?$/, "");
}

type Row = {
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  tag: string;
  publishedAt: Date | null;
  createdAt: Date;
  cover: { id: string; alt: string | null; width: number | null; height: number | null } | null;
};

function toView(n: Row): NewsItem {
  const d = n.publishedAt ?? n.createdAt;
  return {
    slug: n.slug,
    date: formatRuDate(d),
    iso: d.toISOString().slice(0, 10),
    tag: n.tag,
    title: n.title,
    excerpt: n.excerpt,
    bodyHtml: n.bodyHtml,
    cover: n.cover
      ? {
          url: `/media/${n.cover.id}`,
          alt: n.cover.alt ?? "",
          width: n.cover.width,
          height: n.cover.height,
        }
      : null,
  };
}

const loadPublished = unstable_cache(
  async (): Promise<NewsItem[]> => {
    const rows = await prisma.newsItem.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: coverSelect,
    });
    return rows.map(toView);
  },
  ["news-published"],
  { tags: ["news"], revalidate: 3600 },
);

export const getPublishedNews = cache(loadPublished);

export const getLatestNews = cache(async (count: number): Promise<NewsItem[]> => {
  const all = await getPublishedNews();
  return all.slice(0, count);
});

const loadBySlug = unstable_cache(
  async (slug: string): Promise<NewsItem | null> => {
    const row = await prisma.newsItem.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: coverSelect,
    });
    return row ? toView(row) : null;
  },
  ["news-by-slug"],
  { tags: ["news"], revalidate: 3600 },
);

export const getNewsBySlug = cache(loadBySlug);

export const getNewsSlugs = cache(async (): Promise<string[]> => {
  const all = await getPublishedNews();
  return all.map((n) => n.slug);
});

// — Предпросмотр (draftMode): чтение без кэша, включая черновики —

/** Новость по slug в любом статусе. Только для режима предпросмотра. */
export async function getNewsBySlugPreview(slug: string): Promise<NewsItem | null> {
  const row = await prisma.newsItem.findFirst({
    where: { slug },
    include: coverSelect,
  });
  return row ? toView(row) : null;
}

/** Все новости, включая черновики. Только для режима предпросмотра. */
export async function getAllNewsPreview(): Promise<NewsItem[]> {
  const rows = await prisma.newsItem.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: coverSelect,
  });
  return rows.map(toView);
}
