import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { SvedenPage } from "../../sveden/_shell";
import { EntityEditor } from "../../sveden/_EntityEditor";

export const metadata: Metadata = { title: "Главная страница" };

export default async function HomeContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <SvedenPage
      title="Главная страница"
      description="Числовые показатели и блок «Преимущества обучения». Слоган hero редактируется в профиле организации."
      error={error}
      backHref="/admin/site"
      backLabel="К разделу «Сайт и контакты»"
    >
      <div className="space-y-12">
        <EntityEditor entityKey="statItem" redirectPath="/admin/site/home" />
        <EntityEditor entityKey="advantage" redirectPath="/admin/site/home" />
      </div>
    </SvedenPage>
  );
}
