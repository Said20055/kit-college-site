import { getSvedenSections } from "@/lib/data/sveden";
import { SvedenNav } from "@/components/sveden/SvedenNav";

export default async function SvedenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = await getSvedenSections();

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[270px_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details className="rounded-xl border bg-surface p-2 lg:hidden">
            <summary className="cursor-pointer list-none rounded-lg px-3 py-2 font-semibold text-foreground">
              Разделы сведений
            </summary>
            <div className="mt-2">
              <SvedenNav sections={sections} />
            </div>
          </details>

          <nav aria-label="Разделы сведений об организации" className="hidden lg:block">
            <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-fg">
              Сведения об организации
            </p>
            <SvedenNav sections={sections} />
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
