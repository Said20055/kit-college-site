"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "../_actions/users";

export function ResetPasswordForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    undefined,
  );

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <input
        name="password"
        type="text"
        required
        minLength={10}
        placeholder="Новый пароль"
        aria-label="Новый пароль"
        className="w-40 rounded-lg border bg-background px-2 py-1 text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
      >
        {pending ? "…" : "Сбросить пароль"}
      </button>
      {state?.error && <span className="text-xs text-destructive">{state.error}</span>}
      {state?.ok && <span className="text-xs text-success">Пароль обновлён</span>}
    </form>
  );
}
