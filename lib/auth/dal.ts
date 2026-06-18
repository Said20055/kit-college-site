import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionToken, hashToken } from "@/lib/auth/session";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

/**
 * Проверяет сессию у источника данных (БД). Мемоизируется на время рендера.
 * Это «надёжная» проверка — proxy.ts делает лишь оптимистичную (по наличию cookie).
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  if (!session.user.isActive) return null;

  const u = session.user;
  return { id: u.id, email: u.email, fullName: u.fullName, role: u.role };
});

/** Требует аутентификации; иначе — редирект на вход. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Требует роль «администратор»; иначе — назад на дашборд с пометкой. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin?denied=1");
  return user;
}
