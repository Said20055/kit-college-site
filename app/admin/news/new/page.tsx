import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { getMediaList } from "@/lib/data/media";
import { NewsForm } from "../../_components/NewsForm";

export const metadata: Metadata = { title: "Новая новость" };

export default async function NewNewsPage() {
  await requireUser();
  const images = (await getMediaList("IMAGE")).map((m) => ({
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
      <h1 className="font-serif text-2xl font-bold text-foreground">Новая новость</h1>
      <NewsForm images={images} />
    </div>
  );
}
