import type { Metadata } from "next";
import Image from "next/image";
import { FileText } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { getMediaList } from "@/lib/data/media";
import { MediaUploader } from "../_components/MediaUploader";
import { CopyButton } from "../_components/CopyButton";
import { ConfirmButton } from "../_components/ConfirmButton";
import { deleteMediaAction } from "../_actions/media";
import { formatBytes } from "../_lib/format";

export const metadata: Metadata = { title: "Медиатека" };

const copyCls =
  "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs text-foreground transition hover:bg-muted";
const delCls =
  "inline-flex items-center gap-1 rounded border border-destructive/40 px-1.5 py-0.5 text-xs text-destructive transition hover:bg-destructive/10";

export default async function MediaPage() {
  await requireUser();
  const items = await getMediaList();
  const images = items.filter((m) => m.kind === "IMAGE");
  const docs = items.filter((m) => m.kind === "DOC");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">Медиатека</h1>
        <p className="mt-1 text-sm text-muted-fg">
          Изображения и документы сайта. Файлы доступны по адресу <code className="text-xs">/media/…</code>
        </p>
      </header>

      <MediaUploader />

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold text-foreground">
          Изображения ({images.length})
        </h2>
        {images.length === 0 ? (
          <p className="text-sm text-muted-fg">Изображений пока нет.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-xl border bg-surface">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={m.url}
                    alt={m.alt ?? m.originalName}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5 p-2.5">
                  <p className="truncate text-xs font-medium text-foreground" title={m.originalName}>
                    {m.originalName}
                  </p>
                  <p className="text-[11px] text-muted-fg">
                    {m.width && m.height ? `${m.width}×${m.height} · ` : ""}
                    {formatBytes(m.sizeBytes)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <CopyButton path={m.url} className={copyCls} />
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton
                        message={`Удалить «${m.originalName}»? Файл будет удалён с диска.`}
                        className={delCls}
                      >
                        Удалить
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-bold text-foreground">
          Документы ({docs.length})
        </h2>
        {docs.length === 0 ? (
          <p className="text-sm text-muted-fg">Документов пока нет.</p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border bg-surface">
            {docs.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-foreground"
                >
                  <FileText className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="truncate">{m.originalName}</span>
                </a>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted-fg">{formatBytes(m.sizeBytes)}</span>
                  <CopyButton path={m.url} className={copyCls} />
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton
                      message={`Удалить «${m.originalName}»? Файл будет удалён с диска.`}
                      className={delCls}
                    >
                      Удалить
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
