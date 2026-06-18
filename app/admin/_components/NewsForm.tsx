"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Save, Eye } from "lucide-react";
import { saveNewsAction, type NewsFormState } from "../_actions/news";
import { NewsEditor } from "./NewsEditor";
import { slugify } from "@/lib/slug";

type NewsItemInput = {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  bodyHtml: string;
  status: "DRAFT" | "PUBLISHED";
  coverId: string | null;
};

type ImageOption = { id: string; url: string; alt: string };

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

export function NewsForm({
  item,
  images,
}: {
  item?: NewsItemInput;
  images: ImageOption[];
}) {
  const [state, action, pending] = useActionState<NewsFormState, FormData>(
    saveNewsAction,
    undefined,
  );
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(item?.slug));

  return (
    <form action={action} className="space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="nf-title" className={labelCls}>Заголовок</label>
        <input
          id="nf-title"
          name="title"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputCls}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nf-slug" className={labelCls}>
            Слаг (URL) <span className="font-normal text-muted-fg">/news/…</span>
          </label>
          <input
            id="nf-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className={`${inputCls} font-mono`}
          />
        </div>
        <div>
          <label htmlFor="nf-tag" className={labelCls}>Рубрика</label>
          <input id="nf-tag" name="tag" required defaultValue={item?.tag ?? ""} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="nf-excerpt" className={labelCls}>Краткое описание (для карточек и SEO)</label>
        <textarea
          id="nf-excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={item?.excerpt ?? ""}
          className={inputCls}
        />
      </div>

      <fieldset>
        <legend className={labelCls}>Обложка</legend>
        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer">
            <input type="radio" name="coverId" value="" defaultChecked={!item?.coverId} className="peer sr-only" />
            <span className="grid h-20 w-28 place-items-center rounded-lg border-2 border-border px-2 text-center text-xs text-muted-fg transition peer-checked:border-accent peer-checked:text-accent-700">
              Без обложки
            </span>
          </label>
          {images.map((img) => (
            <label key={img.id} className="cursor-pointer">
              <input
                type="radio"
                name="coverId"
                value={img.id}
                defaultChecked={item?.coverId === img.id}
                className="peer sr-only"
              />
              <Image
                src={img.url}
                alt={img.alt}
                width={112}
                height={80}
                className="h-20 w-28 rounded-lg border-2 border-border object-cover transition peer-checked:border-accent"
              />
            </label>
          ))}
        </div>
        {images.length === 0 && (
          <p className="mt-1.5 text-xs text-muted-fg">
            Загрузите изображения в «Медиатеку», чтобы выбрать обложку.
          </p>
        )}
      </fieldset>

      <div>
        <span className={labelCls}>Текст новости</span>
        <NewsEditor name="bodyHtml" defaultValue={item?.bodyHtml} />
      </div>

      <fieldset className="space-y-2">
        <legend className={labelCls}>Статус</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="status" value="DRAFT" defaultChecked={(item?.status ?? "DRAFT") === "DRAFT"} />
            Черновик
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="status" value="PUBLISHED" defaultChecked={item?.status === "PUBLISHED"} />
            Опубликовано
          </label>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700 disabled:opacity-60"
        >
          <Save className="size-4" aria-hidden="true" />
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
        {item && (
          <a
            href={`/api/preview?slug=${encodeURIComponent(item.slug)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <Eye className="size-4" aria-hidden="true" />
            Предпросмотр
          </a>
        )}
      </div>
    </form>
  );
}
