import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { AuditList } from "../_components/AuditList";

export const metadata: Metadata = { title: "Журнал аудита" };

export default async function AuditPage() {
  await requireAdmin();
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { actor: { select: { fullName: true, email: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">Журнал аудита</h1>
        <p className="mt-1 text-sm text-muted-fg">
          Последние {entries.length} записей: входы, управление пользователями и контентом.
        </p>
      </header>
      <AuditList entries={entries} />
    </div>
  );
}
