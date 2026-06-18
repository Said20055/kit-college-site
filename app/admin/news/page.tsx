import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import {
  publishNewsAction,
  unpublishNewsAction,
  deleteNewsAction,
} from "../_actions/news";
import { ConfirmButton } from "../_components/ConfirmButton";
import { formatDateTime } from "../_lib/format";

export const metadata: Metadata = { title: "Новости" };

const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-fg";
const td = "border-t border-border px-4 py-3 align-top";
const smallBtn =
  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted";

export default async function NewsListPage() {
  await requireUser();
  const items = await prisma.newsItem.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Новости</h1>
          <p className="mt-1 text-sm text-muted-fg">
            Создание, редактирование и публикация новостей.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700"
        >
          <Plus className="size-4" aria-hidden="true" />
          Создать новость
        </Link>
      </header>

      <div className="overflow-x-auto rounded-2xl border bg-surface shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className={th}>Заголовок</th>
              <th className={th}>Статус</th>
              <th className={th}>Дата</th>
              <th className={th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td className={`${td} text-muted-fg`} colSpan={4}>
                  Новостей пока нет. Нажмите «Создать новость».
                </td>
              </tr>
            )}
            {items.map((n) => (
              <tr key={n.id}>
                <td className={td}>
                  <Link
                    href={`/admin/news/${n.id}`}
                    className="font-medium text-foreground link-underline"
                  >
                    {n.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-muted-fg">
                    {n.tag} · /news/{n.slug}
                  </div>
                </td>
                <td className={td}>
                  {n.status === "PUBLISHED" ? (
                    <span className="font-medium text-success">Опубликовано</span>
                  ) : (
                    <span className="text-muted-fg">Черновик</span>
                  )}
                </td>
                <td className={`${td} whitespace-nowrap text-muted-fg`}>
                  {formatDateTime(n.publishedAt ?? n.updatedAt)}
                </td>
                <td className={td}>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/news/${n.id}`} className={smallBtn}>
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Изменить
                    </Link>
                    <a
                      href={`/api/preview?slug=${encodeURIComponent(n.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={smallBtn}
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      Предпросмотр
                    </a>
                    {n.status === "PUBLISHED" ? (
                      <form action={unpublishNewsAction}>
                        <input type="hidden" name="id" value={n.id} />
                        <button type="submit" className={smallBtn}>Снять с публикации</button>
                      </form>
                    ) : (
                      <form action={publishNewsAction}>
                        <input type="hidden" name="id" value={n.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition hover:bg-success/20"
                        >
                          Опубликовать
                        </button>
                      </form>
                    )}
                    <form action={deleteNewsAction}>
                      <input type="hidden" name="id" value={n.id} />
                      <ConfirmButton
                        message={`Удалить новость «${n.title}»? Действие необратимо.`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-2.5 py-1 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                      >
                        Удалить
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
