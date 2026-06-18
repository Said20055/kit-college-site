import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { NewsItem } from "@/lib/data/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
    >
      {item.cover && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={item.cover.url}
            alt={item.cover.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-700">
            {item.tag}
          </span>
          <time
            dateTime={item.iso}
            className="inline-flex items-center gap-1.5 text-xs text-muted-fg"
          >
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {item.date}
          </time>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-foreground">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-fg">
          {item.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-700">
          Подробнее
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
