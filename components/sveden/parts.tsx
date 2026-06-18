import type { ReactNode } from "react";
import { FileText, Download, Info } from "lucide-react";
import type { DocItem } from "@/lib/data/sveden";

/** Заголовок смысловой группы внутри подраздела. */
export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-serif text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Строка «поле — значение» с опциональной микроразметкой. */
export function Field({
  label,
  value,
  prop,
}: {
  label: string;
  value: ReactNode;
  prop?: string;
}) {
  return (
    <div className="grid gap-1 border-b border-border py-3 last:border-0 sm:grid-cols-[260px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-muted-fg">{label}</dt>
      <dd className="text-sm text-foreground" itemProp={prop}>
        {value}
      </dd>
    </div>
  );
}

export function FieldList({ children }: { children: ReactNode }) {
  return <dl className="rounded-2xl border bg-surface px-5 sm:px-6">{children}</dl>;
}

/** Список документов со ссылками на скачивание. */
export function DocList({ items }: { items: DocItem[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border bg-surface">
      {items.map((d) => (
        <li key={d.title} itemProp="document">
          <a
            href={d.href}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent-soft/40"
          >
            <FileText className="size-5 shrink-0 text-accent" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">{d.title}</span>
              {d.note && <span className="mt-0.5 block text-xs text-muted-fg">{d.note}</span>}
            </span>
            <Download
              className="size-4 shrink-0 text-muted-fg transition-colors group-hover:text-accent-700"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Адаптивная обёртка для широких таблиц. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-surface">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 flex gap-2.5 rounded-xl border border-accent/20 bg-accent-soft/50 px-4 py-3 text-sm text-accent-700">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-3 text-sm leading-relaxed text-foreground">{children}</div>;
}
