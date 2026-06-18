import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { setUserActiveAction } from "../_actions/users";
import { CreateUserForm } from "../_components/CreateUserForm";
import { ResetPasswordForm } from "../_components/ResetPasswordForm";
import { formatDateTime } from "../_lib/format";

export const metadata: Metadata = { title: "Пользователи" };

const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-fg";
const td = "border-t border-border px-4 py-3 align-top text-foreground";

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-serif text-2xl font-bold text-foreground">Пользователи</h1>
        <p className="mt-1 text-sm text-muted-fg">
          Учётные записи администраторов и редакторов CMS.
        </p>
      </header>

      <CreateUserForm />

      <div className="overflow-x-auto rounded-2xl border bg-surface shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              <th className={th}>ФИО</th>
              <th className={th}>Email</th>
              <th className={th}>Роль</th>
              <th className={th}>Статус</th>
              <th className={th}>Последний вход</th>
              <th className={th}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className={td}>
                  <span className="font-medium">{u.fullName}</span>
                  {u.id === me.id && (
                    <span className="ml-1 text-xs text-muted-fg">(вы)</span>
                  )}
                </td>
                <td className={`${td} break-all`}>{u.email}</td>
                <td className={td}>{u.role === "ADMIN" ? "Администратор" : "Редактор"}</td>
                <td className={td}>
                  {u.isActive ? (
                    <span className="text-success">Активен</span>
                  ) : (
                    <span className="text-destructive">Отключён</span>
                  )}
                </td>
                <td className={`${td} whitespace-nowrap text-muted-fg`}>
                  {formatDateTime(u.lastLoginAt)}
                </td>
                <td className={td}>
                  <div className="space-y-2">
                    {u.id !== me.id && (
                      <form action={setUserActiveAction}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="active" value={u.isActive ? "false" : "true"} />
                        <button
                          type="submit"
                          className="rounded-lg border px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted"
                        >
                          {u.isActive ? "Отключить" : "Включить"}
                        </button>
                      </form>
                    )}
                    <ResetPasswordForm userId={u.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
