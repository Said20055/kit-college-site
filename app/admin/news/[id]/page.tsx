import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { getMediaList } from "@/lib/data/media";
import { NewsForm } from "../../_components/NewsForm";

export const metadata: Metadata = { title: "Редактирование новости" };

type Params = { params: Promise<{ id: string }> };

export default async function EditNewsPage({ params }: Params) {
  await requireUser();
  const { id } = await params;
  const [item, mediaImages] = await Promise.all([
    prisma.newsItem.findUnique({ where: { id } }),
    getMediaList("IMAGE"),
  ]);
  if (!item) notFound();

  const images = mediaImages.map((m) => ({
    id: m.id,
    url: m.url,
    alt: m.alt ?? m.originalName,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1.5 text-sm text-muted-fg transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        К списку новостей
      </Link>
      <h1 className="font-serif text-2xl font-bold text-foreground">
        Редактирование новости
      </h1>
      <NewsForm
        images={images}
        item={{
          id: item.id,
          title: item.title,
          slug: item.slug,
          tag: item.tag,
          excerpt: item.excerpt,
          bodyHtml: item.bodyHtml,
          status: item.status,
          coverId: item.coverId,
        }}
      />
    </div>
  );
}
