import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { updateProfileAction } from "../../_actions/sveden";
import { SvedenPage } from "../../sveden/_shell";

export const metadata: Metadata = { title: "Профиль организации" };

const inputCls =
  "mt-1 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const labelCls = "block text-xs font-medium text-muted-fg";

type Fld = { name: string; label: string; type?: "text" | "textarea"; full?: boolean; placeholder?: string };

const GROUPS: { title: string; fields: Fld[] }[] = [
  {
    title: "Организация",
    fields: [
      { name: "shortName", label: "Краткое наименование" },
      { name: "abbr", label: "Аббревиатура" },
      { name: "fullName", label: "Полное наименование", full: true },
      { name: "tagline", label: "Слоган (hero на главной)", full: true },
      { name: "description", label: "Описание организации", type: "textarea", full: true },
      { name: "founded", label: "Год основания" },
    ],
  },
  {
    title: "Реквизиты",
    fields: [
      { name: "inn", label: "ИНН" },
      { name: "kpp", label: "КПП" },
      { name: "ogrn", label: "ОГРН" },
      { name: "founder", label: "Учредитель", full: true },
      { name: "founderUrl", label: "Сайт учредителя", full: true, placeholder: "https://…" },
    ],
  },
  {
    title: "Руководитель",
    fields: [
      { name: "directorName", label: "ФИО" },
      { name: "directorPost", label: "Должность" },
      { name: "directorReceptionTime", label: "Часы приёма граждан", full: true },
      { name: "directorPhone", label: "Телефон" },
      { name: "directorEmail", label: "E-mail" },
    ],
  },
  {
    title: "Контакты",
    fields: [
      { name: "address", label: "Адрес (полный)", full: true },
      { name: "addressShort", label: "Адрес (краткий)", full: true },
      { name: "phone", label: "Телефон" },
      { name: "phoneHref", label: "Телефон (для ссылки tel:)", placeholder: "+78001234567" },
      { name: "email", label: "E-mail" },
      { name: "workTime", label: "Режим работы", full: true },
      { name: "mapCoords", label: "Координаты на карте", full: true, placeholder: "43.25, 46.58" },
    ],
  },
];

export default async function ProfilePage() {
  await requireUser();
  const p = await prisma.collegeProfile.findUnique({ where: { id: "singleton" } });
  const v = (p ?? {}) as Record<string, string | undefined>;

  return (
    <SvedenPage
      title="Профиль организации"
      description="Используется в шапке, подвале, метаданных, на главной и в разделе «Сведения»."
      backHref="/admin/site"
      backLabel="К разделу «Сайт и контакты»"
    >
      <form action={updateProfileAction} className="space-y-8">
        {GROUPS.map((group) => (
          <fieldset
            key={group.title}
            className="space-y-4 rounded-2xl border bg-surface p-6 shadow-sm"
          >
            <legend className="px-1 font-serif text-lg font-bold text-foreground">
              {group.title}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((f) => (
                <div key={f.name} className={f.full ? "sm:col-span-2" : undefined}>
                  <label htmlFor={f.name} className={labelCls}>
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={f.name}
                      name={f.name}
                      rows={3}
                      defaultValue={v[f.name] ?? ""}
                      className={inputCls}
                    />
                  ) : (
                    <input
                      id={f.name}
                      name={f.name}
                      type="text"
                      placeholder={f.placeholder}
                      defaultValue={v[f.name] ?? ""}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700"
        >
          Сохранить профиль
        </button>
      </form>
    </SvedenPage>
  );
}
