import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarClock,
  FileText,
  Send,
  Phone,
  Mail,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { getCollege } from "@/lib/data/college";
import { getSpecialties } from "@/lib/data/programs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal, Stagger, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Абитуриенту",
  description:
    "Приём 2026: специальности, сроки приёма документов, перечень документов и способы подачи заявления в Колледж инновационных технологий (Хасавюрт).",
};

const steps = [
  { title: "Выберите специальность", text: "Ознакомьтесь с программами и условиями обучения в разделе «Образование»." },
  { title: "Подготовьте документы", text: "Соберите перечень документов для приёмной комиссии." },
  { title: "Подайте заявление", text: "Лично, по почте или через портал «Госуслуги»." },
  { title: "Дождитесь зачисления", text: "Следите за рейтинговыми списками и приказами о зачислении." },
];

const docs = [
  "Заявление о приёме (заполняется в приёмной комиссии)",
  "Документ, удостоверяющий личность и гражданство",
  "Документ об образовании (аттестат) и приложение к нему",
  "4 фотографии 3×4 см",
  "СНИЛС (при наличии)",
  "Медицинская справка (для отдельных специальностей)",
];

export default async function AbiturientPage() {
  const [college, specialties] = await Promise.all([
    getCollege(),
    getSpecialties(),
  ]);

  return (
    <div className="container-page py-12 lg:py-16">
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Абитуриенту" }]} />

      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-700">
          Приём 2026/2027
        </span>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          Абитуриенту
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-fg">
          Приёмная комиссия колледжа начала работу. Поступление на программы СПО — на основании
          аттестата, для большинства специальностей без вступительных испытаний.
        </p>
      </Reveal>

      {/* Ключевые сведения */}
      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: CalendarClock, title: "Сроки приёма", text: "Приём документов: с 1 июня по 15 августа 2026 г. При наличии свободных мест — до 25 ноября." },
          { icon: ClipboardList, title: "Формы обучения", text: "Очная и заочная (по отдельным специальностям). Обучение на бюджетной и договорной основе." },
          { icon: CheckCircle2, title: "Вступительные испытания", text: "Зачисление по среднему баллу аттестата. Для отдельных специальностей — по результатам конкурса." },
        ].map((c) => (
          <RevealItem key={c.title}>
            <div className="flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-sm">
              <c.icon className="size-7 text-accent" aria-hidden="true" />
              <h2 className="mt-4 font-serif text-lg font-bold text-foreground">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-fg">{c.text}</p>
            </div>
          </RevealItem>
        ))}
      </Stagger>

      {/* Шаги поступления */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Как поступить</h2>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <RevealItem key={s.title}>
              <div className="flex h-full flex-col rounded-2xl border bg-surface p-6">
                <span className="font-serif text-4xl font-bold text-accent/30">{i + 1}</span>
                <h3 className="mt-2 font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">{s.text}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </section>

      {/* Документы + способы подачи */}
      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <Reveal className="rounded-2xl border bg-surface p-7">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-accent" aria-hidden="true" />
            <h2 className="font-serif text-xl font-bold text-foreground">Перечень документов</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {docs.map((d) => (
              <li key={d} className="flex gap-3 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="rounded-2xl border bg-surface p-7">
          <div className="flex items-center gap-3">
            <Send className="size-6 text-accent" aria-hidden="true" />
            <h2 className="font-serif text-xl font-bold text-foreground">Способы подачи заявления</h2>
          </div>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-foreground">
            <li>
              <span className="font-semibold">Лично</span> — в приёмной комиссии по адресу:{" "}
              {college.contacts.address}.
            </li>
            <li>
              <span className="font-semibold">По почте</span> — заказным письмом с уведомлением на
              адрес колледжа.
            </li>
            <li>
              <span className="font-semibold">Через «Госуслуги»</span> — в электронной форме с
              использованием суперсервиса «Поступление в вуз / колледж онлайн».
            </li>
          </ul>
          <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
            <a href={`tel:${college.contacts.phoneHref}`} className="inline-flex items-center gap-2 font-semibold text-accent-700">
              <Phone className="size-4" aria-hidden="true" />
              {college.contacts.phone}
            </a>
            <br />
            <a href={`mailto:${college.contacts.email}`} className="inline-flex items-center gap-2 font-semibold text-accent-700">
              <Mail className="size-4" aria-hidden="true" />
              {college.contacts.email}
            </a>
          </div>
        </Reveal>
      </section>

      {/* Специальности */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">Специальности приёма</h2>
          <Link href="/sveden/education" className="link-underline inline-flex items-center gap-1.5 pb-1 text-sm font-semibold text-accent-700">
            Подробнее об образовании
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
          {specialties.map((s) => (
            <RevealItem key={s.code}>
              <div className="flex items-start gap-4 rounded-2xl border bg-surface p-5">
                <span className="font-mono text-sm font-semibold text-accent-700">{s.code}</span>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="mt-1 text-sm text-muted-fg">
                    {s.qualification} · {s.forms} · {s.duration}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}
