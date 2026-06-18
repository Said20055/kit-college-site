import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getSvedenSections } from "@/lib/data/sveden";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Сведения об образовательной организации",
  description:
    "Специальный раздел официального сайта по Приказу Рособрнадзора № 1493: основные сведения, документы, образование, руководство и другое.",
};

export default async function SvedenIndexPage() {
  const svedenSections = await getSvedenSections();

  return (
    <article>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Сведения об образовательной организации" },
        ]}
      />
      <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        Сведения об образовательной организации
      </h1>
      <p className="mt-3 max-w-2xl text-muted-fg">
        Специальный раздел сформирован в соответствии с Приказом Рособрнадзора от 04.08.2023 № 1493
        (в ред. от 03.07.2025). Выберите подраздел для просмотра информации.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {svedenSections.map((s, i) => (
          <li key={s.slug}>
            <Link
              href={`/sveden/${s.slug}`}
              className="group flex h-full items-start gap-4 rounded-2xl border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft font-serif text-sm font-bold tabular-nums text-accent-700"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  {s.title}
                  <ArrowUpRight
                    className="size-4 text-muted-fg transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-700"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-fg">{s.short}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
