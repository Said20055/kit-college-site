import Link from "next/link";
import { GraduationCap, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { getCollege } from "@/lib/data/college";

export async function CtaBand() {
  const college = await getCollege();
  return (
    <section className="relative overflow-hidden bg-primary text-on-primary">
      <div
        data-decorative
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="anim-aurora absolute -right-24 -top-24 size-[26rem] rounded-full bg-accent/30 blur-3xl" />
        <div
          className="anim-aurora absolute -bottom-32 left-1/4 size-[24rem] rounded-full bg-accent/20 blur-3xl"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div className="container-page py-16 lg:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Начните профессиональный путь в 2026 году
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-on-primary/80">
            Приёмная комиссия открыта. Подайте документы лично, по почте или через портал
            «Госуслуги» — поможем с выбором специальности.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/abiturient"
              className="inline-flex items-center gap-2 rounded-lg bg-on-primary px-6 py-3.5 font-semibold text-primary shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-95"
            >
              <GraduationCap className="size-5" aria-hidden="true" />
              Подать документы
            </Link>
            <a
              href={`tel:${college.contacts.phoneHref}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-on-primary/40 px-6 py-3.5 font-semibold text-on-primary transition-colors duration-200 hover:border-on-primary hover:bg-on-primary/10"
            >
              <Phone className="size-5" aria-hidden="true" />
              {college.contacts.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
