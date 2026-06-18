"use client";

import { useId } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { EntityConfig, Field } from "../sveden/_fields";
import { ConfirmButton } from "./ConfirmButton";

type Row = { id: string } & Record<string, unknown>;
type MediaOption = { id: string; label: string };
type ServerAction = (formData: FormData) => void | Promise<void>;

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const labelCls = "block text-xs font-medium text-muted-fg";

function FieldInput({
  field,
  value,
  mediaDocs,
}: {
  field: Field;
  value?: unknown;
  mediaDocs: MediaOption[];
}) {
  const id = `${useId()}-${field.name}`;
  const common = { id, name: field.name, required: field.required, className: inputCls };

  if (field.type === "bool") {
    return (
      <label className="flex items-center gap-2 py-1.5 text-sm text-foreground">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="size-4 rounded border accent-accent"
        />
        {field.label}
      </label>
    );
  }

  return (
    <div className={field.full ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className={labelCls}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>
      <div className="mt-1">
        {field.type === "textarea" ? (
          <textarea {...common} rows={3} defaultValue={(value as string) ?? ""} />
        ) : field.type === "int" ? (
          <input {...common} type="number" step="1" defaultValue={value === undefined || value === null ? "" : String(value)} />
        ) : field.type === "select" ? (
          <select {...common} defaultValue={(value as string) ?? ""}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : field.type === "media" ? (
          <select {...common} defaultValue={(value as string) ?? ""}>
            <option value="">— файл не выбран —</option>
            {mediaDocs.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        ) : (
          <input {...common} type="text" placeholder={field.placeholder} defaultValue={(value as string) ?? ""} />
        )}
      </div>
      {field.help && <p className="mt-1 text-xs text-muted-fg">{field.help}</p>}
    </div>
  );
}

function Fields({ fields, row, mediaDocs }: { fields: Field[]; row?: Row; mediaDocs: MediaOption[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={row?.[f.name]} mediaDocs={mediaDocs} />
      ))}
    </div>
  );
}

export function CollectionEditor({
  config,
  items,
  createAction,
  updateAction,
  deleteAction,
  mediaDocs = [],
}: {
  config: EntityConfig;
  items: Row[];
  createAction: ServerAction;
  updateAction: ServerAction;
  deleteAction: ServerAction;
  mediaDocs?: MediaOption[];
}) {
  const submitCls =
    "inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-foreground">{config.labelPlural}</h2>
        <span className="text-xs text-muted-fg">{items.length} зап.</span>
      </div>

      {/* Добавление */}
      <details className="rounded-2xl border bg-surface shadow-sm">
        <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-semibold text-accent-700">
          <Plus className="size-4" aria-hidden="true" />
          Добавить ({config.label})
        </summary>
        <form action={createAction} className="space-y-4 border-t border-border p-5">
          <Fields fields={config.fields} mediaDocs={mediaDocs} />
          <button type="submit" className={submitCls}>
            <Plus className="size-4" aria-hidden="true" />
            Добавить
          </button>
        </form>
      </details>

      {/* Список */}
      <ul className="space-y-2">
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed bg-surface px-5 py-6 text-center text-sm text-muted-fg">
            Записей пока нет.
          </li>
        )}
        {items.map((item) => {
          const title = String(item[config.titleField] ?? item.id);
          return (
            <li key={item.id} className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
              <details>
                <summary className="flex cursor-pointer items-center gap-3 px-5 py-3.5 text-sm">
                  <Pencil className="size-4 shrink-0 text-muted-fg" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">{title}</span>
                  {"order" in item && (
                    <span className="shrink-0 text-xs text-muted-fg">№ {String(item.order)}</span>
                  )}
                </summary>
                <div className="space-y-4 border-t border-border p-5">
                  <form action={updateAction} className="space-y-4">
                    <input type="hidden" name="id" value={item.id} />
                    <Fields fields={config.fields} row={item} mediaDocs={mediaDocs} />
                    <button type="submit" className={submitCls}>
                      Сохранить
                    </button>
                  </form>
                  <form action={deleteAction} className="border-t border-border pt-4">
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmButton
                      message={`Удалить запись «${title}»? Действие необратимо.`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Удалить
                    </ConfirmButton>
                  </form>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
