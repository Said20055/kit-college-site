"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Circle = {
  id: number;
  x: number;
  y: number;
  color: string;
  fadeState: "in" | "out" | null;
};

type UseHoverCirclesOptions = {
  /** Доп. классы круга (размер/размытие). По умолчанию — компактные, как у кнопки. */
  circleClassName?: string;
  /** Класс непрозрачности круга в активном состоянии. По умолчанию `opacity-75`. */
  activeOpacityClassName?: string;
  /** Минимальный интервал между кругами, мс. Меньше — плотнее след. По умолчанию 100. */
  throttleMs?: number;
};

/**
 * Эффект светящегося следа за курсором. Навесьте `setRef` и обработчики на любой
 * контейнер с классами `relative isolate overflow-hidden` и отрендерьте внутри него
 * `circles`. CSS-переменные следа задаются через `cssVars` (или у любого предка).
 */
export function useHoverCircles(options?: UseHoverCirclesOptions) {
  const circleClassName = options?.circleClassName ?? "h-3 w-3 blur-lg";
  const activeOpacityClassName = options?.activeOpacityClassName ?? "opacity-75";
  const throttleMs = options?.throttleMs ?? 100;

  const elementRef = React.useRef<HTMLElement | null>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [circles, setCircles] = React.useState<Circle[]>([]);
  const lastAddedRef = React.useRef(0);

  const setRef = React.useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  const createCircle = React.useCallback((x: number, y: number) => {
    const width = elementRef.current?.offsetWidth || 0;
    const xPos = width ? x / width : 0;
    const color = `linear-gradient(to right, var(--circle-start) ${xPos * 100}%, var(--circle-end) ${xPos * 100}%)`;
    setCircles((prev) => [
      ...prev,
      { id: Date.now(), x, y, color, fadeState: null },
    ]);
  }, []);

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isListening) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const now = Date.now();
      if (now - lastAddedRef.current > throttleMs) {
        lastAddedRef.current = now;
        const rect = event.currentTarget.getBoundingClientRect();
        createCircle(event.clientX - rect.left, event.clientY - rect.top);
      }
    },
    [isListening, createCircle, throttleMs],
  );

  const onPointerEnter = React.useCallback(() => setIsListening(true), []);
  const onPointerLeave = React.useCallback(() => setIsListening(false), []);

  React.useEffect(() => {
    circles.forEach((circle) => {
      if (!circle.fadeState) {
        setTimeout(() => {
          setCircles((prev) =>
            prev.map((c) =>
              c.id === circle.id ? { ...c, fadeState: "in" } : c,
            ),
          );
        }, 0);

        setTimeout(() => {
          setCircles((prev) =>
            prev.map((c) =>
              c.id === circle.id ? { ...c, fadeState: "out" } : c,
            ),
          );
        }, 1000);

        setTimeout(() => {
          setCircles((prev) => prev.filter((c) => c.id !== circle.id));
        }, 2200);
      }
    });
  }, [circles]);

  const cssVars = {
    "--circle-start": "var(--tw-gradient-from, #a0d9f8)",
    "--circle-end": "var(--tw-gradient-to, #3a5bbf)",
  } as React.CSSProperties;

  const circleNodes = circles.map(({ id, x, y, color, fadeState }) => (
    <span
      key={id}
      className={cn(
        "pointer-events-none absolute z-[-1] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300",
        circleClassName,
        fadeState === "in" && activeOpacityClassName,
        fadeState === "out" && "opacity-0 duration-[1.2s]",
        !fadeState && "opacity-0",
      )}
      style={{ left: x, top: y, background: color }}
    />
  ));

  return {
    setRef,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
    cssVars,
    circles: circleNodes,
  };
}

interface HoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** Если задан — компонент рендерится как навигационная ссылка Next.js, сохраняя эффект. */
  href?: string;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, href, ...props }, ref) => {
    const glow = useHoverCircles();

    const classes = cn(
      "relative isolate px-8 py-3 rounded-3xl",
      "text-foreground font-medium text-base leading-6",
      "backdrop-blur-lg bg-[rgba(43,55,80,0.1)]",
      "cursor-pointer overflow-hidden",
      "before:content-[''] before:absolute before:inset-0",
      "before:rounded-[inherit] before:pointer-events-none",
      "before:z-[1]",
      "before:shadow-[inset_0_0_0_1px_rgba(170,202,255,0.2),inset_0_0_16px_0_rgba(170,202,255,0.1),inset_0_-3px_12px_0_rgba(170,202,255,0.15),0_1px_3px_0_rgba(0,0,0,0.50),0_4px_12px_0_rgba(0,0,0,0.45)]",
      "before:mix-blend-multiply before:transition-transform before:duration-300",
      "active:before:scale-[0.975]",
      className,
    );

    if (href) {
      return (
        <Link
          href={href}
          ref={glow.setRef}
          className={classes}
          style={glow.cssVars}
          onPointerMove={glow.onPointerMove}
          onPointerEnter={glow.onPointerEnter}
          onPointerLeave={glow.onPointerLeave}
        >
          {glow.circles}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={(node) => {
          glow.setRef(node);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={classes}
        onPointerMove={glow.onPointerMove}
        onPointerEnter={glow.onPointerEnter}
        onPointerLeave={glow.onPointerLeave}
        {...props}
        style={glow.cssVars}
      >
        {glow.circles}
        {children}
      </button>
    );
  },
);

HoverButton.displayName = "HoverButton";

export { HoverButton };
