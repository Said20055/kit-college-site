import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getNewsBySlug, getNewsBySlugPreview } from "@/lib/data/news";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PreviewBanner } from "@/components/PreviewBanner";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const item = isEnabled ? await getNewsBySlugPreview(slug) : await getNewsBySlug(slug);
  if (!item) return {};
  return { title: item.title, description: item.excerpt };
}

export default async function NewsArticlePage({ params }: Params) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const item = isEnabled ? await getNewsBySlugPreview(slug) : await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <>
      {isEnabled && <PreviewBanner />}
      <div className="container-page py-12 lg:py-16">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Новости", href: "/news" },
            { label: item.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-700">
              {item.tag}
            </span>
            <time dateTime={item.iso} className="inline-flex items-center gap-1.5 text-sm text-muted-fg">
              <CalendarDays className="size-4" aria-hidden="true" />
              {item.date}
            </time>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {item.title}
          </h1>

          {item.cover && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={item.cover.url}
                alt={item.cover.alt}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="mt-7 space-y-5 text-lg leading-relaxed text-foreground/90 [&_a]:text-accent-700 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-fg [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
          />

          <div className="mt-12 border-t border-border pt-6">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-700 transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Ко всем новостям
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
