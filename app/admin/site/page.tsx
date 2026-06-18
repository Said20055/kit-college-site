import type { Metadata } from "next";
import Link from "next/link";
import { Building2, LayoutPanelTop, Menu, ChevronRight, type LucideIcon } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Сайт и контакты" };

type Card = { href: string; title: string; desc: string; icon: LucideIcon; count?: number };

export default async function SiteHubPage() {
  await requireUser();
  const [stats, advantages, nav] = await Promise.all([
    prisma.statItem.count(),
    prisma.advantage.count(),
    prisma.navItem.count(),
  ]);

  const cards: Card[] = [
    {
      href: "/admin/site/profile",
      title: "Профиль организации",
      desc: "Наименования, реквизиты (ИНН/КПП/ОГРН), учредитель, руководитель и контакты.",
      icon: Building2,
    },
    {
      href: "/admin/site/home",
      title: "Главная страница",
      desc: "Числовые показатели и блок «Преимущества».",
      icon: LayoutPanelTop,
      count: stats + advantages,
    },
    {
      href: "/admin/site/nav",
      title: "Главное меню",
      desc: "Пункты верхней навигации сайта и их порядок.",
      icon: Menu,
      count: nav,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">Сайт и контакты</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-fg">
          Общие данные организации, контент главной страницы и навигация. Изменения появляются на
          сайте без передеплоя.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-start gap-4 rounded-2xl border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-700">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{c.title}</span>
                  {c.count !== undefined && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-fg">
                      {c.count}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-fg">{c.desc}</span>
              </span>
              <ChevronRight
                className="size-5 shrink-0 text-muted-fg transition group-hover:translate-x-0.5 group-hover:text-accent-700"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
