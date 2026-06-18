import { auditActionLabel, formatDateTime } from "../_lib/format";

export type AuditEntryView = {
  id: string;
  action: string;
  summary: string | null;
  ip: string | null;
  createdAt: Date;
  actor: { fullName: string; email: string } | null;
};

export function AuditList({ entries }: { entries: AuditEntryView[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-fg">Записей пока нет.</p>;
  }
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border bg-surface">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {auditActionLabel(e.action)}
            </p>
            <p className="text-xs text-muted-fg">
              {e.actor ? `${e.actor.fullName} (${e.actor.email})` : "система"}
              {e.summary ? ` · ${e.summary}` : ""}
            </p>
          </div>
          <p className="shrink-0 text-xs tabular-nums text-muted-fg">
            {formatDateTime(e.createdAt)}
            {e.ip ? ` · ${e.ip}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
