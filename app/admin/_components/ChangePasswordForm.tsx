"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound } from "lucide-react";
import { changeOwnPasswordAction, type ActionState } from "../_actions/users";

const inputCls =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-accent";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    changeOwnPasswordAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form ref={formRef} action={action} className="max-w-md space-y-4">
      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p
          role="status"
          className="rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-sm text-success"
        >
          Пароль изменён.
        </p>
      )}
      <div>
        <label htmlFor="cp-current" className={labelCls}>Текущий пароль</label>
        <input id="cp-current" name="currentPassword" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="cp-new" className={labelCls}>
          Новый пароль <span className="font-normal text-muted-fg">(мин. 10 символов)</span>
        </label>
        <input id="cp-new" name="newPassword" type="password" autoComplete="new-password" required minLength={10} className={inputCls} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700 disabled:opacity-60"
      >
        <KeyRound className="size-4" aria-hidden="true" />
        {pending ? "Сохранение…" : "Сменить пароль"}
      </button>
    </form>
  );
}
