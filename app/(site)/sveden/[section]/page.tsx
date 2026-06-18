import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSvedenSections, getSvedenSectionMeta, getSvedenData } from "@/lib/data/sveden";
import { buildSectionContent } from "@/components/sveden/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type Params = { params: Promise<{ section: string }> };

export async function generateStaticParams() {
  const sections = await getSvedenSections();
  return sections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { section } = await params;
  const found = await getSvedenSectionMeta(section);
  if (!found) return {};
  return { title: found.title, description: found.short };
}

export default async function SvedenSectionPage({ params }: Params) {
  const { section } = await params;
  const [found, data] = await Promise.all([
    getSvedenSectionMeta(section),
    getSvedenData(),
  ]);
  const content = buildSectionContent(data)[section];
  if (!found || !content) notFound();

  return (
    <article>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Сведения об образовательной организации", href: "/sveden" },
          { label: found.title },
        ]}
      />
      <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {found.title}
      </h1>
      <p className="mt-3 max-w-2xl text-muted-fg">{found.short}</p>

      {found.intro && (
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground">
          {found.intro.split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      <div className="mt-8">{content}</div>

      <p className="mt-12 border-t border-border pt-5 text-xs leading-relaxed text-muted-fg">
        Информация актуализируется в течение 10 рабочих дней с момента изменений (Постановление
        Правительства РФ от 20.10.2021 № 1802). Реквизиты, числовые и персональные данные приведены
        как образец и подлежат замене на официальные перед публикацией.
      </p>
    </article>
  );
}
