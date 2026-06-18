"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { GraduationCap, BookOpen, ShieldCheck, MapPin } from "lucide-react";
import { useA11y } from "@/components/a11y/A11yProvider";
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero";
import { useHoverCircles } from "@/components/ui/hover-button";

const BUILDING_IMAGE = "/images/college-building.jpg";

const ADVANTAGES = [
  "Государственная аккредитация",
  "Бюджетные места",
  "Отсрочка от армии",
];

/** Единый блок брендинга (бейдж, H1, подзаголовок, CTA, преимущества). */
function HeroCopy({
  tone,
  centered = false,
  entrance = true,
  shortName,
  tagline,
}: {
  tone: "light" | "dark";
  centered?: boolean;
  /** Анимация появления при монтировании. Отключается, когда появление управляется скроллом. */
  entrance?: boolean;
  shortName: string;
  tagline: string;
}) {
  const reduce = useReducedMotion();
  const light = tone === "light";

  return (
    <motion.div
      initial={entrance ? { opacity: 0, y: reduce ? 0 : 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={centered ? "text-center" : ""}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur ${
          light
            ? "border border-white/30 bg-white/10 text-white"
            : "border border-accent/30 bg-surface/70 text-accent-700"
        }`}
      >
        <MapPin className="size-4" aria-hidden="true" />
        Хасавюрт · Республика Дагестан
      </span>

      <h1
        className={`mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl ${
          light
            ? "text-white [text-shadow:_0_2px_24px_rgb(0_0_0_/_45%)]"
            : "text-foreground"
        }`}
      >
        {shortName}
      </h1>

      <p
        className={`mt-5 max-w-xl text-lg leading-relaxed ${centered ? "mx-auto" : ""} ${
          light ? "text-white/90" : "text-muted-fg"
        }`}
      >
        {tagline}. Современное профессиональное образование в сфере ИТ,
        информационной безопасности, транспорта, экономики и права — на бюджетной
        основе.
      </p>

      <div className={`mt-8 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
        <Link
          href="/abiturient"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-semibold text-on-primary shadow-md transition-all duration-200 hover:bg-accent-700 hover:shadow-lg"
        >
          <GraduationCap className="size-5" aria-hidden="true" />
          Поступить в 2026
        </Link>
        <Link
          href="/sveden/education"
          className={`inline-flex items-center gap-2 rounded-lg border-2 px-6 py-3.5 font-semibold backdrop-blur transition-colors duration-200 ${
            light
              ? "border-white/40 bg-white/10 text-white hover:bg-white/20"
              : "border-border bg-surface text-foreground hover:border-accent hover:text-accent-700"
          }`}
        >
          <BookOpen className="size-5" aria-hidden="true" />
          Специальности
        </Link>
      </div>

      <ul
        className={`mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm ${
          centered ? "justify-center" : ""
        } ${light ? "text-white/90" : "text-muted-fg"}`}
      >
        {ADVANTAGES.map((t) => (
          <li key={t} className="inline-flex items-center gap-2">
            <ShieldCheck
              className={`size-5 ${light ? "text-emerald-300" : "text-success"}`}
              aria-hidden="true"
            />
            {t}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Hero({
  shortName,
  tagline,
}: {
  shortName: string;
  tagline: string;
}) {
  const { settings } = useA11y();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Постепенное проявление панели по мере прокрутки (иммерсивный режим):
  // стартуем с «подсказки» — панель сразу читаема и доходит до полной чёткости.
  const { scrollY } = useScroll();
  const panelOpacity = useTransform(scrollY, [0, 320], [0.4, 1]);
  const panelY = useTransform(scrollY, [0, 320], [22, 0]);

  // Светящийся след за курсором по полупрозрачной панели — заметный, но мягкий.
  const glow = useHoverCircles({
    circleClassName: "h-14 w-14 blur-2xl",
    activeOpacityClassName: "opacity-90",
    throttleMs: 55,
  });

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Версия для слабовидящих: тематический текстовый герой, фон-изображение скрыто.
  if (mounted && settings.enabled) {
    return (
      <section className="border-b bg-background">
        <div className="container-page py-16 lg:py-20">
          <HeroCopy tone="dark" shortName={shortName} tagline={tagline} />
        </div>
      </section>
    );
  }

  // Десктоп с анимацией: иммерсивный параллакс-герой со зданием колледжа.
  const immersive = mounted && isDesktop && !reduce;
  if (immersive) {
    return (
      <section className="relative border-b bg-primary">
        <SmoothScrollHero
          scrollHeight={900}
          desktopImage={BUILDING_IMAGE}
          mobileImage={BUILDING_IMAGE}
          initialClipPercentage={18}
          finalClipPercentage={82}
          imageAlt="Здание Колледжа инновационных технологий"
        >
          <div
            style={
              {
                "--circle-start": "#dbeafe",
                "--circle-end": "#3b82f6",
              } as React.CSSProperties
            }
            className="flex h-full items-end justify-center px-6 pb-14 lg:pb-20"
          >
            <motion.div
              ref={glow.setRef}
              onPointerMove={glow.onPointerMove}
              onPointerEnter={glow.onPointerEnter}
              onPointerLeave={glow.onPointerLeave}
              style={{ opacity: panelOpacity, y: panelY }}
              className="pointer-events-auto relative isolate w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-black/40 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-12"
            >
              {glow.circles}
              <HeroCopy
                tone="light"
                centered
                entrance={false}
                shortName={shortName}
                tagline={tagline}
              />
            </motion.div>
          </div>
        </SmoothScrollHero>
      </section>
    );
  }

  // По умолчанию (мобильные / reduced-motion / SSR): статичный герой с фото здания.
  return (
    <section className="relative overflow-hidden border-b bg-primary">
      <div data-decorative aria-hidden="true" className="absolute inset-0">
        <Image
          src={BUILDING_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/35" />
      </div>
      <div className="container-page relative flex min-h-[34rem] flex-col justify-end py-16 sm:min-h-[40rem]">
        <HeroCopy tone="light" shortName={shortName} tagline={tagline} />
      </div>
    </section>
  );
}
