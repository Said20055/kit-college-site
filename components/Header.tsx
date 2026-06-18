"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Phone, MapPin, GraduationCap, ExternalLink } from "lucide-react";
import type { College, NavItem } from "@/lib/data/college";
import { Logo } from "./Logo";
import { A11yToggleButton } from "./a11y/A11yControls";

export function Header({ college, nav }: { college: College; nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      {/* Верхняя служебная панель */}
      <div className="hidden bg-primary text-on-primary md:block">
        <div className="container-page flex items-center justify-between gap-4 py-1.5 text-[13px]">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {college.contacts.addressShort}
            </span>
            <a
              href={`tel:${college.contacts.phoneHref}`}
              className="inline-flex items-center gap-1.5 link-underline"
            >
              <Phone className="size-4" aria-hidden="true" />
              {college.contacts.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.gosuslugi.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 link-underline"
            >
              Госуслуги <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
            <Link href="/eios" className="inline-flex items-center gap-1.5 link-underline">
              ЭИОС
            </Link>
            <A11yToggleButton className="!px-2 !py-1 text-on-primary hover:!bg-white/10 hover:!text-on-primary" />
          </div>
        </div>
      </div>

      {/* Основная панель */}
      <div
        className={`border-b bg-surface/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <Logo abbr={college.abbr} />

          <nav aria-label="Основная навигация" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-accent-700"
                        : "text-secondary hover:text-accent-700"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/abiturient"
              className="hidden items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all duration-200 hover:bg-accent-700 hover:shadow-md sm:inline-flex"
            >
              <GraduationCap className="size-4.5" aria-hidden="true" />
              Поступить
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-lg border text-secondary xl:hidden"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Мобильная навигация"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b bg-surface xl:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block rounded-md px-3 py-3 text-base font-medium ${
                      isActive(item.href)
                        ? "bg-accent-soft text-accent-700"
                        : "text-secondary hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/abiturient"
                  className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-base font-semibold text-on-primary"
                >
                  <GraduationCap className="size-5" aria-hidden="true" />
                  Поступить в колледж
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
