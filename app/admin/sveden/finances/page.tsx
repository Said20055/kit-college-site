import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { updateFinancesAction } from "../../_actions/sveden";
import { SvedenPage } from "../_shell";

export const metadata: Metadata = { title: "Финансово-хозяйственная деятельность" };

const inputCls =
  "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const labelCls = "block text-xs font-medium text-muted-fg";

const FIELDS: { name: keyof Data; label: string; placeholder?: string; full?: boolean }[] = [
  { name: "year", label: "Отчётный период (год)", placeholder: "2025" },
  { name: "budgetVolume", label: "Объём образовательной деятельности", full: true },
  { name: "income", label: "Поступление финансовых и материальных средств", full: true },
  { name: "spending", label: "Расходование финансовых и материальных средств", full: true },
  { name: "planHref", label: "Ссылка на план ФХД", placeholder: "/docs/… или https://…", full: true },
];

type Data = { year: string; budgetVolume: string; income: string; spending: string; planHref: string };

export default async function FinancesPage() {
  await requireUser();
  const f = await prisma.finances.findUnique({ where: { id: "singleton" } });
  const value: Data = {
    year: f?.year ?? "",
    budgetVolume: f?.budgetVolume ?? "",
    income: f?.income ?? "",
    spending: f?.spending ?? "",
    planHref: f?.planHref ?? "",
  };

  return (
    <SvedenPage
      title="Финансово-хозяйственная деятельность"
      description="Данные подраздела «Финансово-хозяйственная деятельность»."
    >
      <form
        action={updateFinancesAction}
        className="space-y-4 rounded-2xl border bg-surface p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.name} className={field.full ? "sm:col-span-2" : undefined}>
              <label htmlFor={field.name} className={labelCls}>
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="text"
                defaultValue={value[field.name]}
                placeholder={field.placeholder}
                className={`mt-1 ${inputCls}`}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-accent-700"
        >
          Сохранить
        </button>
      </form>
    </SvedenPage>
  );
}
