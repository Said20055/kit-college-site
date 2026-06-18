import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../_shell";
import { EntityEditor } from "../_EntityEditor";

export const metadata: Metadata = { title: "МТО, доступная среда, стипендии" };

export default async function FacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="МТО, доступная среда, стипендии"
      description="Материально-техническое обеспечение («Материально-техническое обеспечение»), специальные условия для ОВЗ («Доступная среда») и меры поддержки («Стипендии и меры поддержки»)."
      error={error}
    >
      <div className="space-y-12">
        <EntityEditor entityKey="mtbItem" redirectPath="/admin/sveden/facilities" />
        <EntityEditor entityKey="ovzCondition" redirectPath="/admin/sveden/facilities" />
        <EntityEditor entityKey="stipend" redirectPath="/admin/sveden/facilities" />
      </div>
    </SvedenPage>
  );
}
