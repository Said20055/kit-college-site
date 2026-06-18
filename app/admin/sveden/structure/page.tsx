import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../_shell";
import { EntityEditor } from "../_EntityEditor";

export const metadata: Metadata = { title: "Структура и органы управления" };

export default async function StructurePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="Структура и органы управления"
      description="Структурные подразделения и коллегиальные органы управления (подраздел «Структура»)."
      error={error}
    >
      <div className="space-y-12">
        <EntityEditor entityKey="structUnit" redirectPath="/admin/sveden/structure" />
        <EntityEditor entityKey="governanceBody" redirectPath="/admin/sveden/structure" />
      </div>
    </SvedenPage>
  );
}
