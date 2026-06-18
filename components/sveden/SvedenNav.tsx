"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SvedenSectionMeta } from "@/lib/data/sveden";

export function SvedenNav({
  className,
  sections,
}: {
  className?: string;
  sections: SvedenSectionMeta[];
}) {
  const pathname = usePathname();

  return (
    <ul className={className ?? "space-y-0.5 text-sm"}>
      {sections.map((s, i) => {
        const href = `/sveden/${s.slug}`;
        const active = pathname === href;
        return (
          <li key={s.slug}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex gap-2.5 rounded-lg px-3 py-2 leading-snug transition-colors ${
                active
                  ? "bg-accent-soft font-semibold text-accent-700"
                  : "text-muted-fg hover:bg-muted hover:text-foreground"
              }`}
            >
              <span
                aria-hidden="true"
                className={`tabular-nums ${active ? "text-accent-700" : "text-muted-fg/60"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
