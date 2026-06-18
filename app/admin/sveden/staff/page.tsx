import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../_shell";
import { EntityEditor } from "../_EntityEditor";

export const metadata: Metadata = { title: "Руководство и педагогический состав" };

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="Руководство и педагогический состав"
      description="Руководители и заместители (подраздел «Руководство») и персональный состав педагогических работников (подраздел «Педагогический состав»)."
      error={error}
    >
      <div className="space-y-12">
        <EntityEditor entityKey="manager" redirectPath="/admin/sveden/staff" />
        <EntityEditor entityKey="teacher" redirectPath="/admin/sveden/staff" />
      </div>
    </SvedenPage>
  );
}
