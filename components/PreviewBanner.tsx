import { Eye } from "lucide-react";

/** Плашка режима предпросмотра черновиков. Ссылка «Выйти» — обычная <a> (без prefetch). */
export function PreviewBanner() {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-black">
      <span className="inline-flex items-center gap-2">
        <Eye className="size-4" aria-hidden="true" />
        Режим предпросмотра — показаны черновики, как они будут выглядеть на сайте.
      </span>
      <a
        href="/api/preview/disable"
        className="rounded bg-black/15 px-2 py-0.5 font-semibold underline"
      >
        Выйти из предпросмотра
      </a>
    </div>
  );
}
