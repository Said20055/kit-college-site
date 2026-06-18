import type { Metadata } from "next";
import Link from "next/link";
import {
  ListTree,
  FileText,
  GraduationCap,
  Building2,
  Users2,
  Wallet,
  Settings2,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Сведения об образовательной организации" };

type Card = {
  href: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  count?: number;
};

export default async function SvedenHubPage() {
  await requireUser();

  const [sections, documents, programs, structUnits, governance, managers, teachers, mtb, ovz, stipends] =
    await Promise.all([
      prisma.svedenSection.count(),
      prisma.document.count(),
      prisma.program.count(),
      prisma.structUnit.count(),
      prisma.governanceBody.count(),
      prisma.manager.count(),
      prisma.teacher.count(),
      prisma.mtbItem.count(),
      prisma.ovzCondition.count(),
      prisma.stipend.count(),
    ]);

  const cards: Card[] = [
    {
      href: "/admin/sveden/sections",
      title: "Подразделы",
      desc: "Включение, порядок, названия и вводный текст подразделов «Сведений».",
      icon: Settings2,
      count: sections,
    },
    {
      href: "/admin/sveden/documents",
      title: "Документы",
      desc: "Устав, лицензия, аккредитация, платные услуги. Привязка файлов из медиатеки.",
      icon: FileText,
      count: documents,
    },
    {
      href: "/admin/sveden/programs",
      title: "Образовательные программы",
      desc: "Специальности, численность, вакантные места, ссылки на ФГОС.",
      icon: GraduationCap,
      count: programs,
    },
    {
      href: "/admin/sveden/structure",
      title: "Структура и органы управления",
      desc: "Структурные подразделения и коллегиальные органы управления.",
      icon: ListTree,
      count: structUnits + governance,
    },
    {
      href: "/admin/sveden/staff",
      title: "Руководство и педсостав",
      desc: "Руководители, заместители и персональный состав педагогических работников.",
      icon: Users2,
      count: managers + teachers,
    },
    {
      href: "/admin/sveden/facilities",
      title: "МТО, доступная среда, стипендии",
      desc: "Материально-техническое обеспечение, условия для ОВЗ, меры поддержки.",
      icon: Building2,
      count: mtb + ovz + stipends,
    },
    {
      href: "/admin/sveden/finances",
      title: "Финансово-хозяйственная деятельность",
      desc: "Объём, поступление и расходование средств, план ФХД.",
      icon: Wallet,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Сведения об образовательной организации
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-fg">
          Редактирование данных спецраздела по требованиям Приказа Рособрнадзора № 1493. Обязательная
          микроразметка сохраняется автоматически — вы правите только содержимое.
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
