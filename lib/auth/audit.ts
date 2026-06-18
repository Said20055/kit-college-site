import "server-only";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/** IP и User-Agent из заголовков запроса (за обратным прокси — x-forwarded-for). */
export async function getRequestMeta(): Promise<{
  ip: string | null;
  userAgent: string | null;
}> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : h.get("x-real-ip"))?.trim() || null;
  return { ip, userAgent: h.get("user-agent") || null };
}

export type AuditEntry = {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  meta?: Prisma.InputJsonValue;
};

/** Записывает действие в журнал аудита вместе с IP/UA. */
export async function logAudit(entry: AuditEntry): Promise<void> {
  const { ip, userAgent } = await getRequestMeta();
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId ?? null,
      action: entry.action,
      entityType: entry.entityType ?? null,
      entityId: entry.entityId ?? null,
      summary: entry.summary ?? null,
      ip,
      userAgent,
      meta: entry.meta,
    },
  });
}
