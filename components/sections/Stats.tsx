import { Counter } from "@/components/motion/Counter";
import { Stagger, RevealItem } from "@/components/motion/Reveal";
import { getStats } from "@/lib/data/home";

export async function Stats() {
  const stats = await getStats();
  return (
    <section className="border-b bg-primary text-on-primary">
      <div className="container-page py-14 lg:py-16">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label} className="text-center">
              <div className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mx-auto mt-3 max-w-[12rem] text-sm font-medium leading-snug text-on-primary/75">
                {s.label}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
