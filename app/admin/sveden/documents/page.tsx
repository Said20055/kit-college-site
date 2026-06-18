import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../_shell";
import { EntityEditor } from "../_EntityEditor";

export const metadata: Metadata = { title: "Документы" };

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="Документы"
      description="Устав, лицензия, аккредитация, локальные акты и платные услуги. Привяжите файл из медиатеки или укажите внешнюю ссылку."
      error={error}
    >
      <EntityEditor entityKey="document" redirectPath="/admin/sveden/documents" />
    </SvedenPage>
  );
}
