"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroyCurrentSession } from "@/lib/auth/session";
import { getCurrentUser } from "@/lib/auth/dal";
import { getRequestMeta, logAudit } from "@/lib/auth/audit";
import { loginSchema } from "@/lib/auth/validation";

const MAX_FAILED = 5;
const LOCK_MS = 1000 * 60 * 15; // 15 минут

export type LoginState = { error?: string } | undefined;

// Хеш-«пустышка» для выравнивания времени ответа, когда пользователь не найден
// (защита от перечисления учёток по таймингу). Вычисляется один раз.
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  return (dummyHash ??= hashPassword("timing-equalization-placeholder"));
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Введите корректный email и пароль" };

  const { email, password } = parsed.data;
  const { ip, userAgent } = await getRequestMeta();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await verifyPassword(password, await getDummyHash());
    await logAudit({ action: "login.failed", summary: `неизвестный email: ${email}` });
    return { error: "Неверный email или пароль" };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await logAudit({ actorId: user.id, action: "login.locked", summary: email });
    return { error: "Учётная запись временно заблокирована. Повторите позже." };
  }

  if (!user.isActive) {
    await logAudit({ actorId: user.id, action: "login.inactive", summary: email });
    return { error: "Учётная запись отключена. Обратитесь к администратору." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const failed = user.failedLoginCount + 1;
    const lock = failed >= MAX_FAILED;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: lock ? 0 : failed,
        lockedUntil: lock ? new Date(Date.now() + LOCK_MS) : null,
      },
    });
    await logAudit({ actorId: user.id, action: "login.failed", summary: email });
    return {
      error: lock
        ? "Слишком много неудачных попыток. Учётная запись заблокирована на 15 минут."
        : "Неверный email или пароль",
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
  await createSession(user.id, { ip, userAgent });
  await logAudit({ actorId: user.id, action: "login.success", summary: email });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const user = await getCurrentUser();
  await logAudit({
    actorId: user?.id ?? null,
    action: "logout",
    summary: user?.email,
  });
  await destroyCurrentSession();
  redirect("/admin/login");
}
