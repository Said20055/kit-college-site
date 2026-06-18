import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../_shell";
import { EntityEditor } from "../_EntityEditor";

export const metadata: Metadata = { title: "Образовательные программы" };

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="Образовательные программы"
      description="Единый список специальностей. Используется в подразделах «Образование», «Образовательные стандарты», «Вакантные места», а также в маркетинговых блоках сайта."
      error={error}
    >
      <EntityEditor entityKey="program" redirectPath="/admin/sveden/programs" />
    </SvedenPage>
  );
}
