import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Stagger, RevealItem } from "@/components/motion/Reveal";
import { getAdvantages } from "@/lib/data/home";

export async function Advantages() {
  const advantages = await getAdvantages();
  return (
    <section className="border-b bg-surface">
      <div className="container-page py-16 lg:py-24">
        <SectionHeading
          center
          eyebrow="Почему КИТ"
          title="Преимущества обучения в колледже"
          description="Создаём условия, в которых студент получает профессию, востребованную на рынке труда."
        />

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a) => (
            <RevealItem key={a.title}>
              <div className="group flex h-full flex-col rounded-2xl border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent-700 transition-colors duration-300 group-hover:bg-accent group-hover:text-on-primary">
                  <Icon name={a.icon} className="size-6" />
                </span>
                <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-fg">{a.text}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
