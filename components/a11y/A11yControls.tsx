"use client";

import { Eye, X } from "lucide-react";
import { useA11y, type A11yTheme, type A11yFont } from "./A11yProvider";

const THEMES: { id: A11yTheme; label: string; bg: string; fg: string }[] = [
  { id: "white", label: "Чёрным по белому", bg: "#ffffff", fg: "#000000" },
  { id: "black", label: "Белым по чёрному", bg: "#000000", fg: "#ffffff" },
  { id: "beige", label: "Тёмным по бежевому", bg: "#f7f3d6", fg: "#4d4b43" },
  { id: "blue", label: "Синим по голубому", bg: "#9dd1ff", fg: "#063462" },
  { id: "green", label: "Зелёным по тёмному", bg: "#3b2716", fg: "#a9e44d" },
];

const FONTS: { id: A11yFont; label: string; sample: string }[] = [
  { id: "normal", label: "Обычный", sample: "А" },
  { id: "large", label: "Крупный", sample: "А" },
  { id: "xlarge", label: "Очень крупный", sample: "А" },
];

/** Кнопка включения версии для слабовидящих (для шапки). */
export function A11yToggleButton({ className = "" }: { className?: string }) {
  const { enable } = useA11y();
  return (
    <button
      type="button"
      onClick={enable}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent-soft hover:text-accent-700 ${className}`}
      aria-label="Включить версию сайта для слабовидящих"
    >
      <Eye className="size-5 shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">Для слабовидящих</span>
    </button>
  );
}

/** Панель управления версией для слабовидящих. Видна только когда режим включён. */
export function A11yControls() {
  const { settings, disable, update } = useA11y();
  if (!settings.enabled) return null;

  return (
    <section
      aria-label="Настройки версии для слабовидящих"
      className="border-b-2 border-foreground bg-surface"
    >
      <div className="container-page flex flex-col gap-4 py-3 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
          <Eye className="size-5" aria-hidden="true" />
          Версия для слабовидящих
        </div>

        {/* Размер шрифта */}
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Размер шрифта</legend>
          <span className="text-sm">Размер:</span>
          {FONTS.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => update({ font: f.id })}
              aria-pressed={settings.font === f.id}
              title={f.label}
              className={`grid size-9 place-items-center border-2 border-foreground font-bold leading-none ${
                settings.font === f.id ? "bg-foreground text-background" : "bg-transparent"
              }`}
              style={{ fontSize: `${0.9 + i * 0.3}rem` }}
            >
              {f.sample}
            </button>
          ))}
        </fieldset>

        {/* Цветовая схема */}
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Цветовая схема</legend>
          <span className="text-sm">Цвет:</span>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ theme: t.id })}
              aria-pressed={settings.theme === t.id}
              title={t.label}
              className="grid size-9 place-items-center border-2 font-bold leading-none"
              style={{
                background: t.bg,
                color: t.fg,
                borderColor: settings.theme === t.id ? t.fg : t.bg,
                outline: settings.theme === t.id ? `2px solid ${t.fg}` : "none",
                outlineOffset: "2px",
              }}
            >
              Ц
            </button>
          ))}
        </fieldset>

        {/* Изображения */}
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Изображения</legend>
          <span className="text-sm">Изображения:</span>
          <button
            type="button"
            onClick={() => update({ images: settings.images === "on" ? "off" : "on" })}
            aria-pressed={settings.images === "off"}
            className="border-2 border-foreground px-3 py-1.5 text-sm font-medium"
          >
            {settings.images === "on" ? "Выключить" : "Включить"}
          </button>
        </fieldset>

        {/* Кернинг */}
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Межбуквенный интервал</legend>
          <span className="text-sm">Интервал:</span>
          <button
            type="button"
            onClick={() => update({ kerning: settings.kerning === "wide" ? "normal" : "wide" })}
            aria-pressed={settings.kerning === "wide"}
            className="border-2 border-foreground px-3 py-1.5 text-sm font-medium"
          >
            {settings.kerning === "wide" ? "Обычный" : "Большой"}
          </button>
        </fieldset>

        <button
          type="button"
          onClick={disable}
          className="inline-flex items-center gap-2 border-2 border-foreground px-3 py-1.5 text-sm font-semibold lg:ml-auto"
        >
          <X className="size-4" aria-hidden="true" />
          Обычная версия
        </button>
      </div>
    </section>
  );
}
