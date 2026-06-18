"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin, requireUser } from "@/lib/auth/dal";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { logAudit } from "@/lib/auth/audit";
import { createUserSchema, passwordSchema } from "@/lib/auth/validation";

export type ActionState = { error?: string; ok?: boolean } | undefined;

export async function createUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = createUserSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }
  const { email, fullName, role, password } = parsed.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    return { error: "Пользователь с таким email уже существует" };
  }

  const created = await prisma.user.create({
    data: { email, fullName, role, passwordHash: await hashPassword(password) },
  });
  await logAudit({
    actorId: admin.id,
    action: "user.create",
    entityType: "User",
    entityId: created.id,
    summary: `${email} (${role})`,
  });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserActiveAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const active = formData.get("active") === "true";
  if (!userId || userId === admin.id) return; // нельзя отключить самого себя

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive: active },
  });
  if (!active) {
    await prisma.session.deleteMany({ where: { userId } }); // завершаем сессии
  }
  await logAudit({
    actorId: admin.id,
    action: active ? "user.activate" : "user.deactivate",
    entityType: "User",
    entityId: userId,
    summary: user.email,
  });
  revalidatePath("/admin/users");
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Некорректный пароль" };
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(parsed.data) },
  });
  await prisma.session.deleteMany({ where: { userId } }); // требуем повторный вход
  await logAudit({
    actorId: admin.id,
    action: "user.reset_password",
    entityType: "User",
    entityId: userId,
    summary: user.email,
  });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function changeOwnPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await requireUser();
  const current = String(formData.get("currentPassword") ?? "");
  const parsed = passwordSchema.safeParse(formData.get("newPassword"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Некорректный новый пароль" };
  }
  const dbUser = await prisma.user.findUnique({ where: { id: me.id } });
  if (!dbUser || !(await verifyPassword(current, dbUser.passwordHash))) {
    return { error: "Текущий пароль неверен" };
  }
  await prisma.user.update({
    where: { id: me.id },
    data: { passwordHash: await hashPassword(parsed.data) },
  });
  await logAudit({ actorId: me.id, action: "user.change_password", summary: me.email });
  return { ok: true };
}
