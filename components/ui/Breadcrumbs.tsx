import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-6">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-fg"
      >
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={`${c.label}-${i}`}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="inline-flex items-center gap-1.5"
            >
              {c.href && !last ? (
                <Link href={c.href} itemProp="item" className="transition-colors hover:text-accent-700">
                  <span itemProp="name">{c.label}</span>
                </Link>
              ) : (
                <span itemProp="name" aria-current={last ? "page" : undefined} className={last ? "font-medium text-foreground" : ""}>
                  {c.label}
                </span>
              )}
              <meta itemProp="position" content={String(i + 1)} />
              {!last && <ChevronRight className="size-3.5 text-muted-fg/60" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
