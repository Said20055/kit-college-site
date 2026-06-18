import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, RevealItem } from "@/components/motion/Reveal";
import { getSpecialties } from "@/lib/data/programs";

export async function Specialties() {
  const specialties = await getSpecialties();
  return (
    <section className="border-b bg-background">
      <div className="container-page py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Специальности"
            title="Чему мы обучаем"
            description="Девять программ среднего профессионального образования по актуальным ФГОС — на бюджетной основе."
          />
          <Link
            href="/sveden/education"
            className="link-underline inline-flex items-center gap-1.5 pb-1 text-sm font-semibold text-accent-700"
          >
            Все специальности
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s) => (
            <RevealItem key={s.code}>
              <Link
                href="/sveden/education"
                className="group flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm font-semibold text-accent-700">
                    {s.code}
                  </span>
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-700">
                    {s.group}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-foreground">
                  {s.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-fg">
                  {s.qualification}
                </p>
                <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-fg">
                  <div className="inline-flex items-center gap-1.5">
                    <GraduationCap className="size-4 text-accent" aria-hidden="true" />
                    <dt className="sr-only">Форма обучения</dt>
                    <dd>{s.forms}</dd>
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-accent" aria-hidden="true" />
                    <dt className="sr-only">Срок обучения</dt>
                    <dd>{s.duration}</dd>
                  </div>
                </dl>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
