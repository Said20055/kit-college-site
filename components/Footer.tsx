import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getCollege } from "@/lib/data/college";
import { getSvedenSections } from "@/lib/data/sveden";
import { Logo } from "./Logo";
import { A11yToggleButton } from "./a11y/A11yControls";

export async function Footer() {
  const [college, svedenSections] = await Promise.all([
    getCollege(),
    getSvedenSections(),
  ]);
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t bg-primary text-on-primary">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo inverse abbr={college.abbr} />
          <p className="text-sm text-on-primary/75">{college.fullName}</p>
          <p className="text-xs text-on-primary/60">
            Учредитель: {college.founder}
          </p>
        </div>

        <nav aria-label="Сведения об организации">
          <h2 className="mb-4 font-serif text-base font-semibold">Сведения</h2>
          <ul className="space-y-2 text-sm text-on-primary/75">
            {svedenSections.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/sveden/${s.slug}`} className="link-underline">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sveden" className="font-medium text-on-primary link-underline">
                Все разделы →
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Навигация">
          <h2 className="mb-4 font-serif text-base font-semibold">Разделы</h2>
          <ul className="space-y-2 text-sm text-on-primary/75">
            <li><Link href="/abiturient" className="link-underline">Абитуриенту</Link></li>
            <li><Link href="/sveden/education" className="link-underline">Образование</Link></li>
            <li><Link href="/news" className="link-underline">Новости</Link></li>
            <li><Link href="/contacts" className="link-underline">Контакты</Link></li>
            <li><Link href="/sveden/paid_edu" className="link-underline">Платные услуги</Link></li>
            <li><Link href="/privacy" className="link-underline">Обработка персональных данных</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-serif text-base font-semibold">Контакты</h2>
          <address className="space-y-3 text-sm not-italic text-on-primary/75">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {college.contacts.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${college.contacts.phoneHref}`} className="link-underline">
                {college.contacts.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${college.contacts.email}`} className="link-underline break-all">
                {college.contacts.email}
              </a>
            </p>
            <p className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {college.contacts.workTime}
            </p>
          </address>
          <div className="mt-4">
            <A11yToggleButton className="border border-on-primary/30 text-on-primary hover:!bg-white/10 hover:!text-on-primary" />
          </div>
        </div>
      </div>

      <div className="border-t border-on-primary/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-on-primary/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {college.abbr}. Официальный сайт.
          </p>
          <p>
            Информация актуализируется в течение 10 рабочих дней (ПП РФ № 1802).
          </p>
        </div>
      </div>
    </footer>
  );
}
