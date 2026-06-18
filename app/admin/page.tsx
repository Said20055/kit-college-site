import Link from "next/link";
import {
  Newspaper,
  GraduationCap,
  FileText,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { AuditList } from "./_components/AuditList";

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-surface p-5 shadow-sm">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-700">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-fg">{label}</p>
      </div>
    </div>
  );
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const [user, { denied }] = await Promise.all([requireUser(), searchParams]);
  const isAdmin = user.role === "ADMIN";

  const [newsCount, programCount, documentCount, recent] = await Promise.all([
    prisma.newsItem.count(),
    prisma.program.count(),
    prisma.document.count(),
    isAdmin
      ? prisma.auditLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { actor: { select: { fullName: true, email: true } } },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Здравствуйте, {user.fullName}
        </h1>
        <p className="mt-1 text-sm text-muted-fg">
          Панель управления официальным сайтом ГБПОУ РД «КИТ».
        </p>
      </header>

      {denied && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
          Недостаточно прав для запрошенного раздела.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Новостей" value={newsCount} icon={Newspaper} />
        <Stat label="Специальностей" value={programCount} icon={GraduationCap} />
        <Stat label="Документов" value={documentCount} icon={FileText} />
      </div>

      <section className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-5 text-sm text-foreground">
        Управление контентом (новости, документы, «Сведения») появится в следующих фазах.
        Сейчас доступны аутентификация, роли и журнал аудита.
      </section>

      {isAdmin && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground">
              Последние действия
            </h2>
            <Link
              href="/admin/audit"
              className="link-underline text-sm font-medium text-accent-700"
            >
              Весь журнал →
            </Link>
          </div>
          <AuditList entries={recent} />
        </section>
      )}
    </div>
  );
}
