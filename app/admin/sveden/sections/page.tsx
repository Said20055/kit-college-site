import type { Metadata } from "next";
import { Pencil } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { updateSectionAction } from "../../_actions/sveden";
import { SvedenPage } from "../_shell";

export const metadata: Metadata = { title: "Подразделы «Сведений»" };

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const labelCls = "block text-xs font-medium text-muted-fg";

export default async function SectionsPage() {
  await requireUser();
  const sections = await prisma.svedenSection.findMany({ orderBy: { order: "asc" } });

  return (
    <SvedenPage
      title="Подразделы «Сведений»"
      description="Видимость, порядок, заголовки и вводный текст подразделов. Состав подразделов фиксирован Приказом № 1493 — их нельзя добавлять или удалять."
    >
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.slug} className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
            <details>
              <summary className="flex cursor-pointer items-center gap-3 px-5 py-3.5 text-sm">
                <Pencil className="size-4 shrink-0 text-muted-fg" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{s.title}</span>
                {!s.isEnabled && (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-fg">
                    скрыт
                  </span>
                )}
                <span className="shrink-0 font-mono text-xs text-muted-fg">{s.slug}</span>
              </summary>
              <form action={updateSectionAction} className="space-y-4 border-t border-border p-5">
                <input type="hidden" name="slug" value={s.slug} />
                <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                  <div>
                    <label htmlFor={`title-${s.slug}`} className={labelCls}>
                      Заголовок
                    </label>
                    <input
                      id={`title-${s.slug}`}
                      name="title"
                      type="text"
                      required
                      defaultValue={s.title}
                      className={`mt-1 ${inputCls}`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`order-${s.slug}`} className={labelCls}>
                      Порядок
                    </label>
                    <input
                      id={`order-${s.slug}`}
                      name="order"
                      type="number"
                      step="1"
                      defaultValue={s.order}
                      className={`mt-1 ${inputCls}`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`short-${s.slug}`} className={labelCls}>
                    Краткое описание (подзаголовок)
                  </label>
                  <input
                    id={`short-${s.slug}`}
                    name="short"
                    type="text"
                    defaultValue={s.short}
                    className={`mt-1 ${inputCls}`}
                  />
                </div>
                <div>
                  <label htmlFor={`intro-${s.slug}`} className={labelCls}>
                    Вводный текст (выводится перед содержимым подраздела)
                  </label>
                  <textarea
                    id={`intro-${s.slug}`}
                    name="intro"
                    rows={3}
                    defaultValue={s.intro ?? ""}
                    className={`mt-1 ${inputCls}`}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="isEnabled"
                    defaultChecked={s.isEnabled}
                    className="size-4 rounded border accent-accent"
                  />
                  Показывать подраздел на сайте
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700"
                >
                  Сохранить
                </button>
              </form>
            </details>
          </li>
        ))}
      </ul>
    </SvedenPage>
  );
}
