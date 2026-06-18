import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPublishedNews, getAllNewsPreview } from "@/lib/data/news";
import { NewsCard } from "@/components/ui/NewsCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Stagger, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости и события Колледжа инновационных технологий: достижения студентов, мероприятия, объявления приёмной комиссии.",
};

export default async function NewsPage() {
  const { isEnabled } = await draftMode();
  const news = isEnabled ? await getAllNewsPreview() : await getPublishedNews();

  return (
    <>
      {isEnabled && <PreviewBanner />}
      <div className="container-page py-12 lg:py-16">
        <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Новости" }]} />
        <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Новости и события
        </h1>
        <p className="mt-3 max-w-2xl text-muted-fg">
          Достижения студентов, мероприятия колледжа и важные объявления приёмной комиссии.
        </p>

        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <RevealItem key={item.slug} className="h-full">
              <NewsCard item={item} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}
