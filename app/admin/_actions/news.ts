"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logAudit } from "@/lib/auth/audit";
import { sanitizeNewsHtml } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";

export type NewsFormState = { error?: string } | undefined;

const newsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Заголовок не короче 3 символов" })
    .max(200, { error: "Слишком длинный заголовок" }),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9-]*$/, { error: "Слаг: только латиница, цифры и дефис" }),
  tag: z.string().trim().min(1, { error: "Укажите рубрику" }).max(60),
  excerpt: z
    .string()
    .trim()
    .min(1, { error: "Добавьте краткое описание" })
    .max(500, { error: "Слишком длинное описание" }),
  status: z.enum(["DRAFT", "PUBLISHED"], { error: "Выберите статус" }),
});

/** Инвалидация кэша новостей: публичные страницы обновляются без передеплоя. */
function revalidateNews() {
  // expire: 0 — немедленная инвалидация: правки видны на сайте при следующем заходе.
  revalidateTag("news", { expire: 0 });
  revalidatePath("/news");
  revalidatePath("/");
}

export async function saveNewsAction(
  _prev: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  const user = await requireUser();
  const id = (formData.get("id") as string) || null;

  const parsed = newsSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    tag: formData.get("tag"),
    excerpt: formData.get("excerpt"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  const { title, tag, excerpt, status } = parsed.data;
  const slug = parsed.data.slug || slugify(title);
  if (!slug) {
    return { error: "Не удалось сформировать слаг — задайте его вручную" };
  }

  const bodyHtml = sanitizeNewsHtml(String(formData.get("bodyHtml") ?? ""));
  if (!bodyHtml || bodyHtml === "<p></p>") {
    return { error: "Текст новости не может быть пустым" };
  }

  const coverId = (formData.get("coverId") as string) || null;

  const clash = await prisma.newsItem.findUnique({ where: { slug } });
  if (clash && clash.id !== id) {
    return { error: `Слаг «${slug}» уже занят другой новостью` };
  }

  const statusLabel = status === "PUBLISHED" ? "опубликовано" : "черновик";

  if (id) {
    const existing = await prisma.newsItem.findUnique({ where: { id } });
    if (!existing) return { error: "Новость не найдена" };
    const publishedAt =
      status === "PUBLISHED"
        ? (existing.publishedAt ?? new Date())
        : existing.publishedAt;
    await prisma.newsItem.update({
      where: { id },
      data: { title, slug, tag, excerpt, bodyHtml, status, publishedAt, coverId },
    });
    await logAudit({
      actorId: user.id,
      action: "news.update",
      entityType: "NewsItem",
      entityId: id,
      summary: `${title} (${statusLabel})`,
    });
  } else {
    const created = await prisma.newsItem.create({
      data: {
        title,
        slug,
        tag,
        excerpt,
        bodyHtml,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        coverId,
      },
    });
    await logAudit({
      actorId: user.id,
      action: "news.create",
      entityType: "NewsItem",
      entityId: created.id,
      summary: `${title} (${statusLabel})`,
    });
  }

  revalidateNews();
  redirect("/admin/news");
}

async function setStatus(
  formData: FormData,
  status: "PUBLISHED" | "DRAFT",
  action: string,
): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const item = await prisma.newsItem.findUnique({ where: { id } });
  if (!item) return;
  await prisma.newsItem.update({
    where: { id },
    data: {
      status,
      publishedAt:
        status === "PUBLISHED" ? (item.publishedAt ?? new Date()) : item.publishedAt,
    },
  });
  await logAudit({
    actorId: user.id,
    action,
    entityType: "NewsItem",
    entityId: id,
    summary: item.title,
  });
  revalidateNews();
}

export async function publishNewsAction(formData: FormData): Promise<void> {
  await setStatus(formData, "PUBLISHED", "news.publish");
}

export async function unpublishNewsAction(formData: FormData): Promise<void> {
  await setStatus(formData, "DRAFT", "news.unpublish");
}

export async function deleteNewsAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const item = await prisma.newsItem.findUnique({ where: { id } });
  if (!item) return;
  await prisma.newsItem.delete({ where: { id } });
  await logAudit({
    actorId: user.id,
    action: "news.delete",
    entityType: "NewsItem",
    entityId: id,
    summary: item.title,
  });
  revalidateNews();
}
