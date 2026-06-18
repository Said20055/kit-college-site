import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCard } from "@/components/ui/NewsCard";
import { Stagger, RevealItem } from "@/components/motion/Reveal";
import { getLatestNews } from "@/lib/data/news";

export async function NewsPreview() {
  const latest = await getLatestNews(3);

  return (
    <section className="border-b bg-background">
      <div className="container-page py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Новости и события"
            title="Жизнь колледжа"
            description="Достижения студентов, мероприятия и важные объявления приёмной комиссии."
          />
          <Link
            href="/news"
            className="link-underline inline-flex items-center gap-1.5 pb-1 text-sm font-semibold text-accent-700"
          >
            Все новости
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((item) => (
            <RevealItem key={item.slug} className="h-full">
              <NewsCard item={item} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
