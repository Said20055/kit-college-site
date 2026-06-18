import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/dal";
import { logoutAction } from "./_actions/auth";
import { AdminNav } from "./_components/AdminNav";

export const metadata: Metadata = {
  title: { default: "Админпанель", template: "%s · Админпанель КИТ" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Неавторизованные состояния (вход) — без оболочки.
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col gap-6 bg-primary px-4 py-6 text-on-primary lg:min-h-screen">
        <div className="px-2">
          <p className="font-serif text-lg font-bold">КИТ · Админпанель</p>
          <p className="text-xs text-on-primary/60">Управление сайтом колледжа</p>
        </div>

        <AdminNav role={user.role} />

        <div className="mt-auto border-t border-on-primary/15 pt-4">
          <p className="px-2 text-sm font-medium">{user.fullName}</p>
          <p className="px-2 text-xs break-all text-on-primary/60">{user.email}</p>
          <p className="mt-1.5 px-2">
            <span className="inline-block rounded bg-on-primary/15 px-2 py-0.5 text-xs">
              {user.role === "ADMIN" ? "Администратор" : "Редактор"}
            </span>
          </p>
          <form action={logoutAction} className="mt-3 px-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-on-primary/30 px-3 py-1.5 text-sm font-medium text-on-primary transition hover:bg-on-primary/10"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Выйти
            </button>
          </form>
        </div>
      </aside>

      <main className="px-5 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
