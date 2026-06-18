"use client";

import { useActionState, useEffect, useRef } from "react";
import { UserPlus } from "lucide-react";
import { createUserAction, type ActionState } from "../_actions/users";

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

export function CreateUserForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createUserAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="grid gap-4 rounded-2xl border bg-surface p-5 shadow-sm sm:grid-cols-2"
    >
      <h2 className="font-serif text-lg font-bold text-foreground sm:col-span-2">
        Новый пользователь
      </h2>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
        >
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p
          role="status"
          className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success sm:col-span-2"
        >
          Пользователь создан.
        </p>
      )}

      <div>
        <label htmlFor="cu-fullName" className={labelCls}>ФИО</label>
        <input id="cu-fullName" name="fullName" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="cu-email" className={labelCls}>Email</label>
        <input id="cu-email" name="email" type="email" autoComplete="off" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="cu-role" className={labelCls}>Роль</label>
        <select id="cu-role" name="role" defaultValue="EDITOR" className={inputCls}>
          <option value="EDITOR">Редактор</option>
          <option value="ADMIN">Администратор</option>
        </select>
      </div>
      <div>
        <label htmlFor="cu-password" className={labelCls}>
          Пароль <span className="font-normal text-muted-fg">(мин. 10 символов)</span>
        </label>
        <input id="cu-password" name="password" type="text" autoComplete="off" required minLength={10} className={inputCls} />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700 disabled:opacity-60"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          {pending ? "Создание…" : "Создать пользователя"}
        </button>
      </div>
    </form>
  );
}
