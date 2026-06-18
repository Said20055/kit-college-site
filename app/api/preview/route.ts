import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/dal";

/** Включает режим предпросмотра (только для авторизованных) и ведёт на страницу новости. */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return new Response("Требуется вход в админпанель", { status: 401 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return new Response("Не указан параметр slug", { status: 400 });

  // Проверяем существование новости и редиректим на путь из БД (без open redirect).
  const item = await prisma.newsItem.findUnique({
    where: { slug },
    select: { slug: true },
  });
  if (!item) return new Response("Новость не найдена", { status: 404 });

  (await draftMode()).enable();
  redirect(`/news/${item.slug}`);
}
