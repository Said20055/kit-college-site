import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { ChangePasswordForm } from "../_components/ChangePasswordForm";

export const metadata: Metadata = { title: "Мой профиль" };

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">Мой профиль</h1>
        <p className="mt-1 text-sm text-muted-fg">Учётные данные и смена пароля.</p>
      </header>

      <dl className="grid gap-px overflow-hidden rounded-2xl border bg-border text-sm">
        <div className="flex justify-between gap-4 bg-surface px-4 py-3">
          <dt className="text-muted-fg">ФИО</dt>
          <dd className="font-medium text-foreground">{user.fullName}</dd>
        </div>
        <div className="flex justify-between gap-4 bg-surface px-4 py-3">
          <dt className="text-muted-fg">Email</dt>
          <dd className="font-medium break-all text-foreground">{user.email}</dd>
        </div>
        <div className="flex justify-between gap-4 bg-surface px-4 py-3">
          <dt className="text-muted-fg">Роль</dt>
          <dd className="font-medium text-foreground">
            {user.role === "ADMIN" ? "Администратор" : "Редактор"}
          </dd>
        </div>
      </dl>

      <section className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-foreground">Смена пароля</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
