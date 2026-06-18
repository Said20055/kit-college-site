import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../../sveden/_shell";
import { EntityEditor } from "../../sveden/_EntityEditor";

export const metadata: Metadata = { title: "Главное меню" };

export default async function NavPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="Главное меню"
      description="Пункты верхней навигации сайта. Порядок задаётся полем «Порядок»."
      error={error}
      backHref="/admin/site"
      backLabel="К разделу «Сайт и контакты»"
    >
      <EntityEditor entityKey="navItem" redirectPath="/admin/site/nav" />
    </SvedenPage>
  );
}
