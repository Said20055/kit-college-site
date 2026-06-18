import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, User } from "lucide-react";
import { getCollege } from "@/lib/data/college";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal, Stagger, RevealItem } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const college = await getCollege();
  return {
    title: "Контакты",
    description: `Контактная информация ${college.shortName}: адрес, телефон, электронная почта, режим работы и реквизиты организации.`,
  };
}

const mapSrc =
  "https://www.openstreetmap.org/export/embed.html?bbox=46.5772%2C43.2456%2C46.5972%2C43.2556&layer=mapnik&marker=43.2506%2C46.5872";

export default async function ContactsPage() {
  const college = await getCollege();

  const cards = [
    { icon: MapPin, title: "Адрес", value: college.contacts.address },
    { icon: Phone, title: "Телефон", value: college.contacts.phone, href: `tel:${college.contacts.phoneHref}` },
    { icon: Mail, title: "Электронная почта", value: college.contacts.email, href: `mailto:${college.contacts.email}` },
    { icon: Clock, title: "Режим работы", value: college.contacts.workTime },
  ];

  return (
    <div className="container-page py-12 lg:py-16">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />

      <Reveal>
        <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Контакты
        </h1>
        <p className="mt-3 max-w-2xl text-muted-fg">
          {college.fullName}
        </p>
      </Reveal>

      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <RevealItem key={c.title}>
            <div className="flex h-full gap-4 rounded-2xl border bg-surface p-6 shadow-sm">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-700">
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-muted-fg">{c.title}</h2>
                {c.href ? (
                  <a href={c.href} className="mt-1 block font-medium text-foreground transition-colors hover:text-accent-700">
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-foreground">{c.value}</p>
                )}
              </div>
            </div>
          </RevealItem>
        ))}
      </Stagger>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Карта */}
        <Reveal className="overflow-hidden rounded-2xl border bg-surface shadow-sm">
          <iframe
            src={mapSrc}
            title="Карта расположения колледжа"
            loading="lazy"
            className="h-[20rem] w-full border-0"
          />
          <div className="flex items-center gap-2 px-5 py-4 text-sm text-muted-fg">
            <MapPin className="size-4 text-accent" aria-hidden="true" />
            {college.contacts.addressShort}
          </div>
        </Reveal>

        {/* Руководитель + реквизиты */}
        <div className="space-y-6">
          <Reveal className="rounded-2xl border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <User className="size-6 text-accent" aria-hidden="true" />
              <h2 className="font-serif text-lg font-bold text-foreground">Руководитель</h2>
            </div>
            <p className="mt-4 font-medium text-foreground">{college.director.name}</p>
            <p className="text-sm text-muted-fg">{college.director.post}</p>
            <p className="mt-3 text-sm text-muted-fg">Приём граждан: {college.director.receptionTime}</p>
          </Reveal>

          <Reveal className="rounded-2xl border bg-surface p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-foreground">Реквизиты</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-fg">ИНН</dt>
                <dd className="text-right font-medium text-foreground">{college.inn}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-fg">КПП</dt>
                <dd className="text-right font-medium text-foreground">{college.kpp}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-fg">ОГРН</dt>
                <dd className="text-right font-medium text-foreground">{college.ogrn}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-fg">
              Реквизиты приведены как образец и подлежат замене на официальные перед публикацией.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
